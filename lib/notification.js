'use strict';
module.exports = function(RED) {
  function utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp+8*60*60;

    // 时间戳转为时间
    var beijing_datetime = new Date(parseInt(timestamp) * 1000);
    return beijing_datetime;
  }
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
      // 判断手机号是否为空/格式不正确
      if (!props.phoneNum) {
        _this.send({
          payload: '手机号为空'
        });
        return;
      }
      if (!/^(\d)+$/.test(props.phoneNum)) {
        _this.send({
          payload: '手机号格式不正确'
        });
        return;
      }
      try {
        var now = new Date();
        var beijingUTC = utc2beijing(now.toISOString());
        var formattedTime = dateFormat('YYYY-mm-dd HH:MM:SS', beijingUTC);
        // 语音外呼
        if (props.notiType === 'phone') {
          // 判断长度
          if (props.TXT_20.length > 20) {
            _this.send({
              payload: 'TXT_20变量长度不得超过20'
            });
            return;
          }
          if (props.TXT_12.length > 20) {
            _this.send({
              payload: 'TXT_12变量长度不得超过20'
            });
            return;
          }
          var vars = {
            TXT_20: props.TXT_20,
            TXT_12: props.TXT_12
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
                TIME : formattedTime,
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
              text: `【机智云】app提醒您，${props.deviceName}的${props.eventName}在${formattedTime}被执行。`
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