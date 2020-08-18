"use strict";
module.exports = function(RED) {
  var request = require('request');
  function DeviceStatusNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    var config = RED.nodes.getNode(props.server);
    _this.on('input', function(msg) {
      _this.log('oninput' + JSON.stringify(config))
      const { condition, dataPointValue, dataPoint, dataPointValueType, device } = props;
      // request({
      //   url: 'device/device/fire',
      //   method: 'post',
      //   data: {
      //     attrs: {
      //       Switch: true,
      //     },
      //     sno: device
      //   },
      // }).then((data) => {
      //   _this.log(JSON.stringify(data))
      // })
      
      // if (passCondition && passDevice) {
      //   _this.send({
      //     payload: msg.payload,
      //   });
      // }
    })
  }
  RED.nodes.registerType("device control", DeviceStatusNode);
}