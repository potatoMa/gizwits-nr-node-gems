"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function(RED) {
  function GizwitsServerNode(props) {
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
      username: this.credentials.user,
      password: this.credentials.password,
      aepUrl: props.aepUrl,
      aepToken: props.aepToken,
    };
  }
  RED.nodes.registerType("GizwitsServer", GizwitsServerNode, {
    credentials: {
      user: { type: 'text' },
      password: { type: 'password' },
    },
});
}