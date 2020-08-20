"use strict";
module.exports = function(RED) {
  var aepRequest = require('./utils/aepRequest');
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    var config = RED.nodes.getNode(props.server);
    _this.on('input', function(msg) {
      var { condition, dataPointValue, dataPoint, dataPointValueType, device, productKey } = props;
      var options = {
        config,
        url: `/device/device/status/${productKey}/${device}`,
        method: 'POST',
        data: {}
      };
      _this.log('设备状态获取:' + JSON.stringify(options))
      aepRequest(options).then(function(res) {
        var deviceData = res.data;
        // 判断是否通过条件判断
        let passCondition = true;
        if (condition && dataPointValue && dataPoint) {
          var currentDp = deviceData[dataPoint];
          let realDataPointValue;
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
          switch (condition) {
            case 'eq':
              passCondition = currentDp === realDataPointValue;
              break;
            case 'neq':
              passCondition = currentDp !== realDataPointValue;
              break;
            case 'lt':
              passCondition = currentDp < realDataPointValue;
              break;
            case 'lte':
              passCondition = currentDp <= realDataPointValue;
              break;
            case 'gt':
              passCondition = currentDp > realDataPointValue;
              break;
            case 'gte':
              passCondition = currentDp >= realDataPointValue;
              break;
            default:
              break;
          }
        }
        // 通过条件判断（如果设置了）以及为选定的设备时，发送到下个节点
        if (passCondition) {
          _this.send({
            payload: JSON.stringify(deviceData),
          });
        }
      }, function(error) {
        _this.send({
          payload: '设备状态获取失败',
        });
      });
    })
  }
  RED.nodes.registerType("设备状态获取", DeviceStatusNode);
}