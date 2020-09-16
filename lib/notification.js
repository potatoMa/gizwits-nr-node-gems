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
  var aepRequest = require('./utils/aepRequest');
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    _this.on('input', async function(msg) {
      _this.log('oninput' + JSON.stringify(props))
      // 语音外呼
      try {
        if (props.notiType === 'phone') {
          var vars = {
            TXT_20: props.TXT_20,
            TXT_32: props.TXT_32
          };
          // 调用呼叫接口
          var options = {
            url: '/v1/application/message/voice_notice',
            method: 'POST',
            headers: {
              'Content-Type': "application/json;charset=UTF-8",
            },
            data: JSON.stringify({
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
            url: '/v1/application/message/sms_notice',
            method: 'POST',
            headers: {
              'Content-Type': "application/json;charset=UTF-8",
            },
            data: JSON.stringify({
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