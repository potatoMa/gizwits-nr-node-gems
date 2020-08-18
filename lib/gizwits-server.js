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
  }
  RED.nodes.registerType("GizwitsServer", GizwitsServerNode, {
    credentials: {
      user: { type: 'text' },
      password: { type: 'password' },
    },
});
}