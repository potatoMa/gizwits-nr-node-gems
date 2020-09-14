"use strict";
module.exports = function(RED) {
  var aepRequest = require('./utils/aepRequest');
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    var config = RED.nodes.getNode(props.server);
    _this.on('input', function(msg) {
      _this.log('oninput' + JSON.stringify(config))
      var { dataPoints, device } = props;
      let attrs = {};
      dataPoints.forEach((item) => {
        var { dataPointValue, dataPoint, dataPointValueType } = item;
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
          attrs[dataPoint] = realDataPointValue;
        }
      })
      var options = {
        config,
        url: `/v1/devices/${device}/control`,
        method: 'POST',
        data: JSON.stringify(attrs)
      };
      _this.log('设备控制:' + JSON.stringify(options))
      aepRequest(options).then(function(res) {
        _this.log('设备控制:' + JSON.stringify(res))
        _this.send({
          payload: '控制成功',
        });
      }, function() {
        _this.send({
          payload: '控制失败',
        });
      });
    })
  }
  RED.nodes.registerType("设备控制", DeviceStatusNode);
}