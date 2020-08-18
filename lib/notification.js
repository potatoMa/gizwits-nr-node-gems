'use strict';
module.exports = function(RED) {
  var moment = require('moment');
  var request = require('request');
  function aepRequest({ config, url, data, method }) {
    return new Promise(function (res, rej) {
      request({
        url: `${config.settings.aepUrl}${url}`,
        method,
        headers: {
          'Content-Type': "application/json;charset=UTF-8",
          Authorization: config.settings.aepToken,
        },
        body: JSON.stringify({
          appKey: 'string',
          data,
          version: '1.0'
        }),
      }, function(error, response) {
        if (!error && response.statusCode == 200 && JSON.parse(response.body).code === '200') {
          res(JSON.parse(response.body));
        } else {
          rej(response);
        }
      });
    });
  }
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    var config = RED.nodes.getNode(props.server);
    _this.on('input', async function(msg) {
      _this.log('oninput' + JSON.stringify(props))
      const { notiType, deviceName, eventName, phoneNum } = props;
      // 语音外呼
      if (notiType === 'phone') {
        // 先获取用户id
        const accountRes = await aepRequest({
          config,
          url: '/sys/sysUser/userDetailInfo',
          method: 'POST',
          data: {}
        });
        if (!accountRes.data) {
          _this.send({
            payload: '获取用户id失败'
          });
          return;
        }
        const sysAccountId = accountRes.data.id;
        // 再通过用户id获取企业id
        const userDetailRes = await aepRequest({
          config,
          url: '/enterprises/detailBySysAccountId',
          method: 'POST',
          data: sysAccountId
        });
        if (!userDetailRes.data) {
          _this.send({
            payload: '获取企业id失败'
          });
          return;
        }
        const enterpriseId = userDetailRes.data.enterpriseId;
        // 再通过企业id获取企业事件id
        const enterEventRes = await aepRequest({
          config,
          url: '/enterprises/voiceCalling/enterpriseEvent/manageQueryPage',
          method: 'POST',
          data: {
            size: 100,
            query: {
              enterpriseId,
            },
            current: 1
          }
        });
        if (!enterEventRes.data) {
          _this.send({
            payload: '获取企业事件id失败'
          });
          return;
        }
        // 过滤出国内的业务事件
        const event = enterEventRes.data.records.find(item => item.eventTypeCategory === 'business' && item.platformList[0].district === 1)
        _this.log(`notification ${JSON.stringify(event)}`)

        // 调用呼叫接口
        if (event) {
          request({
            url: 'http://aep-common-voice-calling-qa-default:8034/ms/enterpriseEvent/innerTrigger',
            method: 'POST',
            body: JSON.stringify({
              enterpriseId: enterpriseId, //机智云企业ID
              enterpriseEventId: event.id, //企业事件ID
              phoneList: [`+86${phoneNum}`], //呼叫目标列表
              vars:{
                TXT_20 : deviceName,
                TIME : moment().format('YYYY-MM-DD HH:mm:ss'),
                TXT_32 : eventName
              }
            })
          }, function(error, response) {
            if (!error && response.statusCode == 200) {
              _this.send({
                payload: '语音呼叫成功'
              });
            } else {
              _this.send({
                payload: '语音呼叫失败'
              });
            }
          });
        }
      } else {
        request({
          url: 'http://aep-dao-message-qa-default:8016/ms/sms/send',
          method: 'POST',
          body: JSON.stringify({
            apiKey: '3d07b3af2167c8c0f79e1377fc00a18b', //云片 api key
            mobile: `+86${phoneNum}`, //发送手机号
            text: `您的${deviceName}在${moment().format('YYYY-MM-DD HH:mm:ss')}发生了${eventName}报警，请及时处理`
          })
        }, function (error, response){
          if (!error && response.statusCode == 200) {
            _this.send({
              payload: '短信发送成功'
            });
          } else {
            _this.send({
              payload: '短信发送失败'
            });
          }
        })
      }
    })
  }
  RED.nodes.registerType('notification', DeviceStatusNode);
}