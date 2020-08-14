"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events = __importStar(require("events"));
var p_retry_1 = __importDefault(require("p-retry"));
var ResourceStatus;
(function (ResourceStatus) {
    ResourceStatus["Connecting"] = "connecting";
    ResourceStatus["Connected"] = "connected";
    ResourceStatus["Error"] = "error";
    ResourceStatus["Closing"] = "closing";
    ResourceStatus["Closed"] = "closed";
})(ResourceStatus = exports.ResourceStatus || (exports.ResourceStatus = {}));
var ResourceHandler = /** @class */ (function (_super) {
    __extends(ResourceHandler, _super);
    function ResourceHandler(factory, opts) {
        var _a, _b, _c, _d, _e;
        var _this = _super.call(this) || this;
        _this.__opts = {
            name: (opts === null || opts === void 0 ? void 0 : opts.name) || 'Resource',
            closer: opts === null || opts === void 0 ? void 0 : opts.closer,
            eventBindings: opts === null || opts === void 0 ? void 0 : opts.eventBindings,
            retry: {
                retries: ((_a = opts === null || opts === void 0 ? void 0 : opts.retry) === null || _a === void 0 ? void 0 : _a.retries) || 10,
                minTimeout: ((_b = opts === null || opts === void 0 ? void 0 : opts.retry) === null || _b === void 0 ? void 0 : _b.minTimeout) || 5000,
                maxTimeout: ((_c = opts === null || opts === void 0 ? void 0 : opts.retry) === null || _c === void 0 ? void 0 : _c.maxTimeout) || Infinity,
                factor: ((_d = opts === null || opts === void 0 ? void 0 : opts.retry) === null || _d === void 0 ? void 0 : _d.factor) || 2,
                randomize: ((_e = opts === null || opts === void 0 ? void 0 : opts.retry) === null || _e === void 0 ? void 0 : _e.randomize) || false,
            },
        };
        _this.__factory = factory;
        _this.__status = ResourceStatus.Connecting;
        _this.__resource = undefined; // TS hack. We set in __connect
        _this.__connect(true);
        return _this;
    }
    Object.defineProperty(ResourceHandler.prototype, "status", {
        get: function () {
            return this.__status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceHandler.prototype, "error", {
        get: function () {
            return this.__err;
        },
        enumerable: true,
        configurable: true
    });
    ResourceHandler.prototype.resource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.__resource];
                    case 1:
                        res = _a.sent();
                        if (!res) {
                            return [2 /*return*/, Promise.reject(new Error(this.__opts + " is not available"))];
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    ResourceHandler.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.__connect();
                        return [4 /*yield*/, this.__resource];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ResourceHandler.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.__status === ResourceStatus.Closed) {
                            return [2 /*return*/, Promise.reject(new Error(this.__opts.name + " is closed"))];
                        }
                        if (this.__status === ResourceStatus.Connecting) {
                            this.__setStatus(ResourceStatus.Closing);
                            return [2 /*return*/, Promise.resolve()];
                        }
                        this.__setStatus(ResourceStatus.Closed);
                        return [4 /*yield*/, this.__resource];
                    case 1:
                        res = _a.sent();
                        if (res == null) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        res.removeAllListeners();
                        if (this.__opts.closer) {
                            return [2 /*return*/, this.__opts.closer(res)];
                        }
                        return [2 /*return*/, res.close()];
                }
            });
        });
    };
    ResourceHandler.prototype.__subscribe = function (res) {
        var _this = this;
        res.once('error', function (err) {
            res.removeAllListeners();
            _this.__err = err;
            _this.__setStatus(ResourceStatus.Error);
            _this.__connect();
            _this.emit('error', err);
        });
        res.once('close', function () {
            res.removeAllListeners();
            _this.__setToClose();
        });
        if (Array.isArray(this.__opts.eventBindings)) {
            this.__opts.eventBindings.forEach(function (i) {
                res.on(i, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this.emit.apply(_this, __spreadArrays([i], args));
                });
            });
        }
    };
    ResourceHandler.prototype.__connect = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (!force) {
            if (this.__status === ResourceStatus.Connecting ||
                this.__status === ResourceStatus.Connected ||
                this.__status === ResourceStatus.Closing ||
                this.__status === ResourceStatus.Closed) {
                return;
            }
        }
        this.__setStatus(ResourceStatus.Connecting);
        this.__err = undefined;
        this.__resource = p_retry_1.default(function () {
            if (_this.__status === ResourceStatus.Closing) {
                _this.__setToClose();
                throw new p_retry_1.default.AbortError("Connection is aborted");
            }
            return _this.__factory();
        }, Object.assign({
            onFailedAttempt: function (err) {
                _this.emit('retry', err);
            },
        }, this.__opts.retry))
            .then(function (res) {
            if (_this.__status === ResourceStatus.Closing) {
                _this.__setToClose();
                return Promise.reject(new Error(_this.__opts.name + " is closed"));
            }
            _this.__subscribe(res);
            _this.__setStatus(ResourceStatus.Connected);
            _this.emit('open');
            return res;
        })
            .catch(function (err) {
            _this.__err = err;
            _this.__setStatus(ResourceStatus.Error);
            _this.emit('error', err);
            return Promise.resolve(null);
        });
    };
    ResourceHandler.prototype.__setToClose = function () {
        this.__resource = Promise.reject(new Error(this.__opts.name + " is closed"));
        this.__err = undefined;
        this.__setStatus(ResourceStatus.Closed);
        this.emit('close');
        this.removeAllListeners();
    };
    ResourceHandler.prototype.__setStatus = function (nextStatus) {
        var _this = this;
        this.__status = nextStatus;
        process.nextTick(function () {
            _this.emit('status', nextStatus);
        });
    };
    return ResourceHandler;
}(events.EventEmitter));
exports.ResourceHandler = ResourceHandler;
