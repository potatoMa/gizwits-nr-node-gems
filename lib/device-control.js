"use strict";
module.exports = function(RED) {
  const request = require('request');
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
    _this.on('input', function(msg) {
      _this.log('oninput' + JSON.stringify(config))
      const { dataPointValue, dataPoint, dataPointValueType, device } = props;
      let realDataPointValue;
      if (dataPointValue && dataPoint) {
        // 根据dataPointValueType转换dataPointValue的值
        switch (dataPointValueType) {
          case 'str':
            realDataPointValue = dataPointValue;
            break;
          case 'num':
            realDataPointValue = Number(dataPointValue);
            break;
          case 'bool':
            realDataPointValue = dataPointValue === 'true';
            break;
          default:
            break;
        }
      } else {
        return
      }
      aepRequest({
        config,
        url: '/device/device/fire',
        method: 'POST',
        data: {
          attrs: {
            [dataPoint]: realDataPointValue,
          },
          sno: device
        }
      }).then(() => {
        _this.send({
          payload: '控制成功',
        });
      }, () => {
        _this.send({
          payload: '控制失败',
        });
      });
    })
  }
  RED.nodes.registerType("device control", DeviceStatusNode);
}