"use strict";
module.exports = function(RED) {
  var aepRequest = require('./utils/aepRequest');
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    _this.on('input', function(msg) {
      var { condition, dataPointValue, dataPoint, dataPointValueType, device } = props;
      var options = {
        url: `/v1/devices/${device}/status`,
        method: 'GET',
      };
      _this.log('设备状态获取:' + JSON.stringify(options))
      aepRequest(options).then(function(res) {
        _this.log('设备状态获取:' + JSON.stringify(res))
        var deviceData = JSON.parse(res.data.attrs || '{}');
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
        // 当设置了数据点时，筛选出对应的数据点
        if (dataPoint) {
          deviceData = {
            [dataPoint]: deviceData[dataPoint],
          };
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