export function compose(context, inputs) {
    return {
        attachments: [
            composeBodyAttachment(context, inputs),
        ],
    };
}
export function composeTitle(context, inputs) {
    let label;
    switch (true) {
        case context.eventName === 'schedule':
            label = 'CRON';
            break;
        case context.ref.startsWith('refs/pull/'):
            label = 'CHECK';
            break;
        default:
            label = 'BUILD';
    }
    switch (true) {
        case inputs.isCancelled: {
            let prefix = inputs.prefixes.cancelled ?? '';
            if (prefix)
                prefix += ' ';
            return `${prefix}${label} CANCELLED`;
        }
        case inputs.isSuccess: {
            let prefix = inputs.prefixes.success ?? '';
            if (prefix)
                prefix += ' ';
            return `${prefix}${label} PASSED`;
        }
        default: {
            let prefix = inputs.prefixes.failure ?? '';
            if (prefix)
                prefix += ' ';
            return `${prefix}${label} FAILED`;
        }
    }
}
export function composeBodyAttachment(context, inputs) {
    let titleStr = `*${composeTitle(context, inputs)}*`;
    let bodyStr = context.commitMessage ?? '';
    const repoURL = `https://github.com/${context.repo}`;
    if (context.ref.startsWith('refs/pull/')) {
        const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/);
        const prNumber = matches?.[1] ?? context.ref;
        const repoStr = `<${repoURL}|${context.repo}>`;
        const refStr = `<${repoURL}/pull/${prNumber}|pr-\#${prNumber}>`;
        titleStr += ` in ${repoStr} \`${refStr}\``;
        if (context.sha && context.commitMessage) {
            const shaStr = `\`<${repoURL}/pull/${prNumber}/commits/${context.sha}|${context.sha.substring(0, 7)}>\``;
            bodyStr = `${shaStr} ${bodyStr}`;
        }
    }
    else {
        const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
        const refName = matches?.[1] ?? context.ref;
        const repoStr = `<${repoURL}|${context.repo}>`;
        const refStr = `<${repoURL}/tree/${refName}|${refName}>`;
        titleStr += ` in ${repoStr} \`${refStr}\``;
        if (context.sha && context.commitMessage) {
            const shaStr = `\`<${repoURL}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``;
            bodyStr = `${shaStr} ${bodyStr}`;
        }
    }
    const actorImage = getActorImageURL(context);
    const actorLink = `<${getActorLinkURL(context)}|${context.actor}>`;
    const workflowStr = `*<${repoURL}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`;
    return {
        actions: composeActions(context, inputs).elements.map(action => ({
            style: action.style,
            text: action.text.text,
            type: 'button',
            url: action.url,
        })),
        color: inputs.isSuccess ? '#2eb67d' : '#e01e5a',
        fallback: composeFallback(context, inputs),
        footer: `${actorLink} using workflow ${workflowStr}`,
        footer_icon: actorImage,
        mrkdwn_in: ['text', 'footer'],
        text: bodyStr ? `${titleStr}\n${bodyStr}` : titleStr,
    };
}
export function composeActions(context, inputs) {
    const repoURL = `https://github.com/${context.repo}`;
    const jobURL = `${repoURL}/actions/runs/${context.runId}`;
    const buttons = [];
    buttons.push({
        text: {
            emoji: true,
            text: 'View Job',
            type: 'plain_text',
        },
        type: 'button',
        url: jobURL,
        ...inputs.isSuccess ? {} : { style: 'danger' },
    });
    if (inputs.isSuccess && inputs.action) {
        buttons.push({
            style: 'primary',
            text: {
                emoji: true,
                text: inputs.action.label,
                type: 'plain_text',
            },
            type: 'button',
            url: inputs.action.url,
        });
    }
    return {
        elements: buttons,
        type: 'actions',
    };
}
export function composeFallback(context, inputs) {
    return `${composeTitle(context, inputs)} in ${context.repo}`;
}
function getActorImageURL(context) {
    if (context.actorAvatarURL)
        return context.actorAvatarURL;
    return `https://avatars.githubusercontent.com/${context.actor}`;
}
function getActorLinkURL(context) {
    const botMatch = context.actor.match(/^(.+)\[bot\]$/);
    if (botMatch) {
        return `https://github.com/apps/${botMatch[1]}`;
    }
    else {
        return `https://github.com/${context.actor}`;
    }
}
