export function composeNotificationText(context, inputs) {
    if (inputs.isCancelled) {
        return `${prefix(inputs.prefixes.cancelled)}BUILD CANCELLED in ${context.repo}`;
    }
    else if (inputs.isSuccess) {
        return `${prefix(inputs.prefixes.success)}BUILD PASSED in ${context.repo}`;
    }
    else {
        return `${prefix(inputs.prefixes.failure)}BUILD FAILED in ${context.repo}`;
    }
}
export function composeStatusText(context, inputs) {
    let statusStr = '';
    if (inputs.isCancelled) {
        statusStr += `${prefix(inputs.prefixes.cancelled)}*BUILD CANCELLED*`;
    }
    else if (inputs.isSuccess) {
        statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`;
    }
    else {
        statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`;
    }
    const repoUrl = `https://github.com/${context.repo}`;
    const repoStr = `<${repoUrl}|${context.repo}>`;
    if (context.ref.startsWith('refs/pull/')) {
        const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/);
        const prNumber = matches?.[1] ?? context.ref;
        const refStr = `<${repoUrl}/pull/${prNumber}|pr-\\#${prNumber}>`;
        statusStr += ` in ${repoStr} \`${refStr}\``;
    }
    else {
        const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
        const refName = matches?.[1] ?? context.ref;
        const refStr = `<${repoUrl}/tree/${refName}|${refName}>`;
        statusStr += ` in ${repoStr} \`${refStr}\``;
    }
    return statusStr;
}
export function composeActorBlock(context, inputs) {
    const actorImage = `https://avatars.githubusercontent.com/${context.actor}`;
    const actorLink = `<https://github.com/${context.actor}|${context.actor}>`;
    return {
        elements: [
            {
                alt_text: context.actor,
                image_url: actorImage,
                type: 'image',
            },
            {
                text: actorLink,
                type: 'mrkdwn',
            },
        ],
        type: 'context',
    };
}
export function composeBodyBlock(context, inputs) {
    const repoUrl = `https://github.com/${context.repo}`;
    const actorLink = `<https://github.com/${context.actor}|${context.actor}>`;
    let commitStr = '';
    if (context.sha) {
        if (context.ref.startsWith('refs/pull/')) {
            const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/);
            const prNumber = matches?.[1] ?? context.ref;
            commitStr = `\`<${repoUrl}/pull/${prNumber}/commits/${context.sha}|${context.sha.substring(0, 7)}>\` `;
        }
        else {
            commitStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\` `;
        }
    }
    return {
        text: {
            text: `${composeStatusText(context, inputs)}\n- ${context.commitMessage} (${commitStr}by ${actorLink})`,
            type: 'mrkdwn',
        },
        type: 'section',
    };
}
export function composeActionsBlock(context, inputs) {
    const repoUrl = `https://github.com/${context.repo}`;
    const jobUrl = `${repoUrl}/actions/runs/${context.runId}`;
    const buttons = [];
    buttons.push({
        text: {
            emoji: true,
            text: 'View job',
            type: 'plain_text',
        },
        type: 'button',
        url: jobUrl,
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
export function composeBodyAttachment(context, inputs) {
    let titleStr = '';
    let bodyStr = context.commitMessage;
    if (inputs.isCancelled) {
        titleStr += `${prefix(inputs.prefixes.cancelled)}*BUILD CANCELLED*`;
    }
    else if (inputs.isSuccess) {
        titleStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`;
    }
    else {
        titleStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`;
    }
    const repoUrl = `https://github.com/${context.repo}`;
    if (context.ref.startsWith('refs/pull/')) {
        const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/);
        const prNumber = matches?.[1] ?? context.ref;
        const repoStr = `<${repoUrl}|${context.repo}>`;
        const refStr = `<${repoUrl}/pull/${prNumber}|pr-\#${prNumber}>`;
        titleStr += ` in ${repoStr} \`${refStr}\``;
        if (context.sha) {
            const shaStr = `\`<${repoUrl}/pull/${prNumber}/commits/${context.sha}|${context.sha.substring(0, 7)}>\``;
            bodyStr = `${shaStr} ${bodyStr}`;
        }
    }
    else {
        const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
        const refName = matches?.[1] ?? context.ref;
        const repoStr = `<${repoUrl}|${context.repo}>`;
        const refStr = `<${repoUrl}/tree/${refName}|${refName}>`;
        titleStr += ` in ${repoStr} \`${refStr}\``;
        if (context.sha) {
            const shaStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``;
            bodyStr = `${shaStr} ${bodyStr}`;
        }
    }
    const actorImage = `https://avatars.githubusercontent.com/${context.actor}`;
    const actorLink = `<https://github.com/${context.actor}|${context.actor}>`;
    const workflowStr = `*<${repoUrl}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`;
    return {
        actions: composeActionsBlock(context, inputs).elements.map(action => ({
            style: action.style,
            text: action.text.text,
            type: 'button',
            url: action.url,
        })),
        color: inputs.isSuccess ? '#2eb67d' : '#e01e5a',
        fallback: composeNotificationText(context, inputs),
        footer: `${actorLink} using workflow ${workflowStr}`,
        footer_icon: actorImage,
        mrkdwn_in: ['text', 'footer'],
        text: `${titleStr}\n${bodyStr}`,
    };
}
export function compose(context, inputs) {
    if (inputs.isVerbose) {
        return {
            attachments: [
                composeBodyAttachment(context, inputs),
            ],
        };
    }
    else {
        return {
            blocks: [
                composeBodyBlock(context, inputs),
                composeActionsBlock(context, inputs),
            ],
            text: composeNotificationText(context, inputs),
        };
    }
}
function prefix(value) {
    if (value === undefined || value === null || value === '')
        return '';
    return `${value} `;
}
