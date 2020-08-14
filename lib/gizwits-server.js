"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
module.exports = function(RED) {
  function GizwitsServerNode(props) {
    var _this = this;
    RED.nodes.createNode(this, props);
    this.settings = {
      vhost: props.vhost,
      host: props.host,
      port: props.port,
      keepAlive: props.keepalive,
      verifyServerCert: props.verifyservercert,
      ca: props.ca,
      topology: props.topology,
      useCA: props.useca,
      useTLS: props.usetls,
      useTopology: props.usetopology,
      iotype: props.iotype,
      ioname: props.ioname,
      username: this.credentials.user || 'aep',
      password: this.credentials.password || 'giZwitS2018',
    };
    var conn = core_1.open(this.settings);
    conn.on('status', function (status) {
      _this.log("[AMQP] Connection status: " + JSON.stringify(_this.settings));
    });
    conn.on('retry', function (retry) {
      _this.log("[AMQP] Connection error: " + retry.message);
      _this.log("[AMQP] Attempt " + retry.attemptNumber + " failed. There are " + retry.retriesLeft + " retries left.");
    });
    this.on('close', function (done) {
      core_1.close(_this.settings).finally(function () { return done(); });
    });
  }
  RED.nodes.registerType("GizwitsServer", GizwitsServerNode, {
    credentials: {
      user: { type: 'text' },
      password: { type: 'password' },
    },
});
}