"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = require("./resource");
var Sender = /** @class */ (function () {
    function Sender(conn, exchange) {
        var _this = this;
        this.__handler = new resource_1.ResourceHandler(function () { return conn.createChannel(); }, {
            name: 'Sender',
            closer: function (ch) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // if connection is not being closed
                    // we can safely close the channel
                    if (conn.status === resource_1.ResourceStatus.Connected) {
                        return [2 /*return*/, ch.close()];
                    }
                    // otherwise, we ignore expplicit closure
                    return [2 /*return*/, Promise.resolve()];
                });
            }); },
        });
        this.__exchange = exchange;
    }
    Object.defineProperty(Sender.prototype, "exchange", {
        get: function () {
            return this.__exchange;
        },
        enumerable: true,
        configurable: true
    });
    Sender.prototype.send = function (topic, payload, options) {
        return __awaiter(this, void 0, void 0, function () {
            var ch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.__handler.resource()];
                    case 1:
                        ch = _a.sent();
                        return [2 /*return*/, ch.publish(this.__exchange, topic, Buffer.from(JSON.stringify(payload), 'utf8'), options)];
                }
            });
        });
    };
    Object.defineProperty(Sender.prototype, "status", {
        get: function () {
            return this.__handler.status;
        },
        enumerable: true,
        configurable: true
    });
    Sender.prototype.ready = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.__handler.resource()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sender.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.__handler.close();
                return [2 /*return*/];
            });
        });
    };
    Sender.prototype.on = function (event, handler) {
        this.__handler.on(event, handler);
    };
    Sender.prototype.once = function (event, handler) {
        this.__handler.on(event, handler);
    };
    Sender.prototype.off = function (event, handler) {
        this.__handler.off(event, handler);
    };
    return Sender;
}());
exports.Sender = Sender;
