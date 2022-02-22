"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = exports.getBooleanInput = exports.getStringInput = void 0;
const core = __importStar(require("@actions/core"));
const assert_1 = __importDefault(require("assert"));
function getStringInput(id, defaultValue) {
    try {
        const input = core.getInput(id, { required: true, trimWhitespace: true });
        return input;
    }
    catch (err) {
        if (defaultValue !== undefined)
            return defaultValue;
        throw Error(`Required string input with ID <${id}> is not provided`);
    }
}
exports.getStringInput = getStringInput;
function getBooleanInput(id, defaultValue) {
    try {
        const input = core.getBooleanInput(id, { required: true });
        return input;
    }
    catch (err) {
        if (defaultValue !== undefined)
            return defaultValue;
        throw Error(`Required boolean input with ID <${id}> is not provided`);
    }
}
exports.getBooleanInput = getBooleanInput;
function getInputs(values) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const successPrefix = (_b = (_a = values === null || values === void 0 ? void 0 : values.prefixes) === null || _a === void 0 ? void 0 : _a.success) !== null && _b !== void 0 ? _b : getStringInput('success-prefix', '🤖');
    const failurePrefix = (_d = (_c = values === null || values === void 0 ? void 0 : values.prefixes) === null || _c === void 0 ? void 0 : _c.failure) !== null && _d !== void 0 ? _d : getStringInput('failure-prefix', '😱');
    const webhookUrl = (_e = values === null || values === void 0 ? void 0 : values.webhookUrl) !== null && _e !== void 0 ? _e : getStringInput('webhook-url');
    const isSuccess = (_f = values === null || values === void 0 ? void 0 : values.isSuccess) !== null && _f !== void 0 ? _f : getBooleanInput('success', false);
    const isVerbose = (_g = values === null || values === void 0 ? void 0 : values.isVerbose) !== null && _g !== void 0 ? _g : getBooleanInput('verbose', true);
    const actionLabel = (_j = (_h = values === null || values === void 0 ? void 0 : values.action) === null || _h === void 0 ? void 0 : _h.label) !== null && _j !== void 0 ? _j : getStringInput('action-label', '');
    const actionUrl = (_l = (_k = values === null || values === void 0 ? void 0 : values.action) === null || _k === void 0 ? void 0 : _k.url) !== null && _l !== void 0 ? _l : getStringInput('action-url', '');
    const hasAction = actionLabel !== '' && actionUrl !== '';
    const hasNoAction = actionLabel === '' && actionUrl === '';
    (0, assert_1.default)(hasAction || hasNoAction, Error('Both <action-label> and <action-url> inputs must be provided'));
    return Object.assign({ prefixes: {
            success: successPrefix,
            failure: failurePrefix,
        }, webhookUrl,
        isSuccess,
        isVerbose }, hasAction ? {
        action: {
            label: actionLabel,
            url: actionUrl,
        },
    } : {});
}
exports.getInputs = getInputs;
