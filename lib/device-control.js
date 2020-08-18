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
        request({
          url: `${config.settings.aepUrl}/device/device/fire`,
          method: 'POST',
          json: true,
          headers: {
            contentType: "application/json;charset=utf-8",
            Authorization: config.settings.aepToken,
            body: JSON.stringify({
              appKey: 'string',
              data: {
                attrs: {
                  Switch: true,
                },
                sno: device
              },
              version: '1.0'
            }),
           },
        }, function(error, response, body) {
          _this.log(JSON.stringify(response))
        });
      
      // if (passCondition && passDevice) {
      //   _this.send({
      //     payload: msg.payload,
      //   });
      // }
    })
  }
  RED.nodes.registerType("device control", DeviceStatusNode);
}