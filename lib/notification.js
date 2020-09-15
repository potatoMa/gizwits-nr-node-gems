'use strict';
module.exports = function(RED) {
  function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
  }
  var request = require('request');
  var aepRequest = require('./utils/aepRequest');
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    var config = RED.nodes.getNode(props.server);
    _this.on('input', async function(msg) {
      _this.log('oninput' + JSON.stringify(props))
      // 语音外呼
      try {
        if (props.notiType === 'phone') {
          // 先获取用户id
          var accountRes = await aepRequest({
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
          var sysAccountId = accountRes.data.id;
          // 再通过用户id获取企业id
          var userDetailRes = await aepRequest({
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
          var enterpriseId = userDetailRes.data.enterpriseId;
          // 再通过企业id获取企业事件id
          var enterEventRes = await aepRequest({
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
          var event = enterEventRes.data.records.find(item => item.eventTypeCategory === 'business' && item.platformList[0].district === 1)
          _this.log(`筛选出国内业务事件 ${JSON.stringify(event)}`)

          var vars = {};
          props.listArgs.forEach(arg => vars[arg] = props[arg]);
          // 调用呼叫接口
          var options = {
            config,
            url: '/v1/application/message/voice_notice',
            method: 'POST',
            headers: {
              'Content-Type': "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              phoneList: [`+86${props.phoneNum}`], //呼叫目标列表
              vars: {
                ...vars,
                TIME : dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
              }
            })
          };
          _this.log(`语音推送: ${JSON.stringify(options)}`)
          aepRequest(options).then(function(res) {
            _this.log(JSON.stringify(res));
            _this.send({
              payload: '语音呼叫成功'
            });
          }, function(error) {
            _this.log(JSON.stringify(error));
            _this.send({
              payload: '语音呼叫失败'
            });
          });
        } else {
          var options = {
            config,
            url: '/v1/application/message/sms_notice',
            method: 'POST',
            headers: {
              'Content-Type': "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              mobile: `+86${props.phoneNum}`, //发送手机号
              text: `【机智云】app提醒您，${props.deviceName}的${props.eventName}在${dateFormat('YYYY-mm-dd HH:MM:SS', new Date())}被执行。`
            })
          };
          _this.log(`短信推送: ${JSON.stringify(options)}`);
          aepRequest(options).then(function(res) {
            _this.log(JSON.stringify(res));
            _this.send({
              payload: '短信发送成功'
            });
          }, function(error) {
            _this.log(JSON.stringify(error));
            _this.send({
              payload: '短信发送失败'
            });
          });
        }
      } catch(err) {
        _this.log(JSON.stringify(err))
      }
    })
  }
  RED.nodes.registerType('发送通知', DeviceStatusNode);
}