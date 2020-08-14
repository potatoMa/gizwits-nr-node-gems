"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
function setStatus(node, status) {
    switch (status) {
        case core_1.ResourceStatus.Connected: {
            node.status({
                fill: 'green',
                shape: 'dot',
                text: 'connected',
            });
            break;
        }
        case core_1.ResourceStatus.Connecting: {
            node.status({
                fill: 'yellow',
                shape: 'ring',
                text: 'connecting',
            });
            break;
        }
        case core_1.ResourceStatus.Error: {
            node.status({
                fill: 'red',
                shape: 'dot',
                text: 'error',
            });
            break;
        }
        default: {
            node.status({
                fill: 'red',
                shape: 'dot',
                text: status.toString(),
            });
            break;
        }
    }
}
exports.setStatus = setStatus;
