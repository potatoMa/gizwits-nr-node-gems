"use strict";
module.exports = function(RED) {
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    _this.on('input', function(msg) {
      _this.log('oninput' + msg.payload)
      if (msg.payload) {
        const deviceData = JSON.parse(msg.payload);
        const { condition, dataPointValue, dataPoint, dataPointValueType, device } = props;
        // 判断是否通过条件判断
        let passCondition = true;
        if (condition && dataPointValue && dataPoint) {
          const currentDp = deviceData.data[dataPoint];
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
        // 判断是否通过设备判断（是否和配置的设备相同，如果配置了的话）
        let passDevice = true;
        if (device) {
          passDevice = deviceData.mac === device;
        }
        // 通过条件判断（如果设置了）以及为选定的设备时，发送到下个节点
        if (passCondition && passDevice) {
          _this.send({
            payload: msg.payload,
          });
        }
      }
    })
  }
  RED.nodes.registerType("device control", DeviceStatusNode);
}