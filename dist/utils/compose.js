"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = exports.composeBodyAttachment = exports.composeActionsBlock = exports.composeBodyBlock = exports.composeActorBlock = exports.composeStatusText = exports.composeNotificationText = void 0;
const lodash_1 = __importDefault(require("lodash"));
function prefix(value) {
    if (lodash_1.default.isEmpty(value))
        return '';
    return `${value} `;
}
function composeNotificationText(context, inputs) {
    if (inputs.isSuccess) {
        return `${prefix(inputs.prefixes.success)}BUILD PASSED in ${context.repo}`;
    }
    else {
        return `${prefix(inputs.prefixes.failure)}BUILD FAILED in ${context.repo}`;
    }
}
exports.composeNotificationText = composeNotificationText;
function composeStatusText(context, inputs) {
    var _a;
    let statusStr = '';
    if (inputs.isSuccess) {
        statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`;
    }
    else {
        statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`;
    }
    const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
    const refName = (_a = matches === null || matches === void 0 ? void 0 : matches[1]) !== null && _a !== void 0 ? _a : context.ref;
    const repoUrl = `https://github.com/${context.repo}`;
    const repoStr = `<${repoUrl}|${context.repo}>`;
    const refStr = `<${repoUrl}/tree/${refName}|${refName}>`;
    statusStr += ` in ${repoStr} \`${refStr}\``;
    return statusStr;
}
exports.composeStatusText = composeStatusText;
function composeActorBlock(context, inputs) {
    const actorImage = `https://avatars.githubusercontent.com/${context.actor}`;
    const actorLink = `<https://github.com/${context.actor}|${context.actor}>`;
    return {
        'type': 'context',
        'elements': [
            {
                'type': 'image',
                'image_url': actorImage,
                'alt_text': context.actor,
            },
            {
                'type': 'mrkdwn',
                'text': actorLink,
            },
        ],
    };
}
exports.composeActorBlock = composeActorBlock;
function composeBodyBlock(context, inputs) {
    const repoUrl = `https://github.com/${context.repo}`;
    const actorLink = `<https://github.com/${context.actor}|${context.actor}>`;
    const commitStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``;
    return {
        'type': 'section',
        'text': {
            'type': 'mrkdwn',
            'text': `${composeStatusText(context, inputs)}\n- ${context.commitMessage} (${commitStr} by ${actorLink})`,
        },
    };
}
exports.composeBodyBlock = composeBodyBlock;
function composeActionsBlock(context, inputs) {
    const repoUrl = `https://github.com/${context.repo}`;
    const jobUrl = `${repoUrl}/actions/runs/${context.runId}`;
    const buttons = [];
    buttons.push(Object.assign({ 'type': 'button', 'text': {
            'type': 'plain_text',
            'text': 'View job',
            'emoji': true,
        }, 'url': jobUrl }, inputs.isSuccess ? {} : { style: 'danger' }));
    if (inputs.isSuccess && inputs.action) {
        buttons.push({
            'type': 'button',
            'text': {
                'type': 'plain_text',
                'text': inputs.action.label,
                'emoji': true,
            },
            'style': 'primary',
            'url': inputs.action.url,
        });
    }
    return {
        'type': 'actions',
        'elements': buttons,
    };
}
exports.composeActionsBlock = composeActionsBlock;
function composeBodyAttachment(context, inputs) {
    var _a;
    let titleStr = '';
    if (inputs.isSuccess) {
        titleStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`;
    }
    else {
        titleStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`;
    }
    const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
    const refName = (_a = matches === null || matches === void 0 ? void 0 : matches[1]) !== null && _a !== void 0 ? _a : context.ref;
    const actorImage = `https://avatars.githubusercontent.com/${context.actor}`;
    const actorLink = `<https://github.com/${context.actor}|${context.actor}>`;
    const repoUrl = `https://github.com/${context.repo}`;
    const repoStr = `<${repoUrl}|${context.repo}>`;
    const refStr = `<${repoUrl}/tree/${refName}|${refName}>`;
    const shaStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``;
    const workflowStr = `*<${repoUrl}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`;
    titleStr += ` in ${repoStr} \`${refStr}\``;
    return {
        'color': inputs.isSuccess ? '#2eb67d' : '#e01e5a',
        'fallback': composeNotificationText(context, inputs),
        'footer_icon': actorImage,
        'footer': `${actorLink} using workflow ${workflowStr}`,
        'mrkdwn_in': ['text', 'footer'],
        'text': `${titleStr}\n${shaStr} ${context.commitMessage}`,
        'actions': composeActionsBlock(context, inputs).elements.map(action => ({
            'type': 'button',
            'text': action.text.text,
            'style': action.style,
            'url': action.url,
        })),
    };
}
exports.composeBodyAttachment = composeBodyAttachment;
function compose(context, inputs) {
    if (inputs.isVerbose) {
        return {
            'attachments': [
                composeBodyAttachment(context, inputs),
            ],
        };
    }
    else {
        return {
            'text': composeNotificationText(context, inputs),
            'blocks': [
                composeBodyBlock(context, inputs),
                composeActionsBlock(context, inputs),
            ],
        };
    }
}
exports.compose = compose;
