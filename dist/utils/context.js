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
exports.getContext = void 0;
const github = __importStar(require("@actions/github"));
const lodash_1 = __importDefault(require("lodash"));
function evalOrThrows(expression, id) {
    try {
        const value = expression();
        if (value === undefined)
            throw Error(`Expression with ID <${id}> evaluated to undefined value`);
        return value;
    }
    catch (err) {
        throw Error(`Error evaluating expression with ID <${id}>`);
    }
}
function getContext(values) {
    var _a, _b, _c, _d, _e, _f, _g;
    const actor = (_a = values === null || values === void 0 ? void 0 : values.actor) !== null && _a !== void 0 ? _a : evalOrThrows(() => github.context.actor, 'actor');
    const commitMessage = (_b = values === null || values === void 0 ? void 0 : values.commitMessage) !== null && _b !== void 0 ? _b : lodash_1.default.get(github.context.payload, 'head_commit.message', '<no commit message>');
    const ref = (_c = values === null || values === void 0 ? void 0 : values.ref) !== null && _c !== void 0 ? _c : evalOrThrows(() => github.context.ref, 'ref');
    const repo = (_d = values === null || values === void 0 ? void 0 : values.repo) !== null && _d !== void 0 ? _d : evalOrThrows(() => `${github.context.repo.owner}/${github.context.repo.repo}`, 'repo');
    const runId = (_e = values === null || values === void 0 ? void 0 : values.runId) !== null && _e !== void 0 ? _e : evalOrThrows(() => isNaN(github.context.runId) ? undefined : github.context.runId.toString(), 'run-id');
    const sha = (_f = values === null || values === void 0 ? void 0 : values.sha) !== null && _f !== void 0 ? _f : evalOrThrows(() => github.context.sha, 'sha');
    const workflow = (_g = values === null || values === void 0 ? void 0 : values.workflow) !== null && _g !== void 0 ? _g : evalOrThrows(() => github.context.workflow, 'workflow');
    return {
        actor,
        commitMessage,
        ref,
        repo,
        runId,
        sha,
        workflow,
    };
}
exports.getContext = getContext;
