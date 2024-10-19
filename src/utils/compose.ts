import { type Context } from './context.js'
import { type Inputs } from './inputs.js'

export function composeNotificationText(context: Context, inputs: Inputs) {
  if (inputs.isCancelled) {
    return `${prefix(inputs.prefixes.cancelled)}BUILD CANCELLED in ${context.repo}`
  }
  else if (inputs.isSuccess) {
    return `${prefix(inputs.prefixes.success)}BUILD PASSED in ${context.repo}`
  }
  else {
    return `${prefix(inputs.prefixes.failure)}BUILD FAILED in ${context.repo}`
  }
}

export function composeStatusText(context: Context, inputs: Inputs) {
  let statusStr = ''

  if (inputs.isCancelled) {
    statusStr += `${prefix(inputs.prefixes.cancelled)}*BUILD CANCELLED*`
  }
  else if (inputs.isSuccess) {
    statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`
  }
  else {
    statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`
  }

  if (context.ref.startsWith('refs/pull/')) {
    const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/)
    const prNumber = matches?.[1] ?? context.ref
    const repoUrl = `https://github.com/${context.repo}`
    const repoStr = `<${repoUrl}|${context.repo}>`
    const refStr = `<${repoUrl}/pull/${prNumber}|pr-\\#${prNumber}>`

    statusStr += ` in ${repoStr} \`${refStr}\``
  }
  else {
    const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
    const refName = matches?.[1] ?? context.ref
    const repoUrl = `https://github.com/${context.repo}`
    const repoStr = `<${repoUrl}|${context.repo}>`
    const refStr = `<${repoUrl}/tree/${refName}|${refName}>`

    statusStr += ` in ${repoStr} \`${refStr}\``
  }

  return statusStr
}

export function composeActorBlock(context: Context, inputs: Inputs) {
  const actorImage = `https://avatars.githubusercontent.com/${context.actor}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`

  return {
    type: 'context',
    elements: [
      {
        type: 'image',
        image_url: actorImage,
        alt_text: context.actor,
      },
      {
        type: 'mrkdwn',
        text: actorLink,
      },
    ],
  }
}

export function composeBodyBlock(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`
  let commitStr = ''

  if (context.sha) {
    if (context.ref.startsWith('refs/pull/')) {
      const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/)
      const prNumber = matches?.[1] ?? context.ref

      commitStr = `\`<${repoUrl}/pull/${prNumber}/commits/${context.sha}|${context.sha.substring(0, 7)}>\` `
    }
    else {
      commitStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\` `
    }
  }

  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${composeStatusText(context, inputs)}\n- ${context.commitMessage} (${commitStr}by ${actorLink})`,
    },
  }
}

export function composeActionsBlock(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const jobUrl = `${repoUrl}/actions/runs/${context.runId}`
  const buttons = []

  buttons.push({
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'View job',
      emoji: true,
    },
    url: jobUrl,
    ...inputs.isSuccess ? {} : { style: 'danger' },
  })

  if (inputs.isSuccess && inputs.action) {
    buttons.push({
      type: 'button',
      text: {
        type: 'plain_text',
        text: inputs.action.label,
        emoji: true,
      },
      style: 'primary',
      url: inputs.action.url,
    })
  }

  return {
    type: 'actions',
    elements: buttons,
  }
}

export function composeBodyAttachment(context: Context, inputs: Inputs) {
  let titleStr = ''
  let bodyStr = context.commitMessage

  if (inputs.isCancelled) {
    titleStr += `${prefix(inputs.prefixes.cancelled)}*BUILD CANCELLED*`
  }
  else if (inputs.isSuccess) {
    titleStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`
  }
  else {
    titleStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`
  }

  const repoUrl = `https://github.com/${context.repo}`

  if (context.ref.startsWith('refs/pull/')) {
    const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/)
    const prNumber = matches?.[1] ?? context.ref
    const repoStr = `<${repoUrl}|${context.repo}>`
    /* eslint-disable-next-line no-useless-escape */
    const refStr = `<${repoUrl}/pull/${prNumber}|pr-\#${prNumber}>`

    titleStr += ` in ${repoStr} \`${refStr}\``

    if (context.sha) {
      const shaStr = `\`<${repoUrl}/pull/${prNumber}/commits/${context.sha}|${context.sha.substring(0, 7)}>\``
      bodyStr = `${shaStr} ${bodyStr}`
    }
  }
  else {
    const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
    const refName = matches?.[1] ?? context.ref
    const repoStr = `<${repoUrl}|${context.repo}>`
    const refStr = `<${repoUrl}/tree/${refName}|${refName}>`

    titleStr += ` in ${repoStr} \`${refStr}\``

    if (context.sha) {
      const shaStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``
      bodyStr = `${shaStr} ${bodyStr}`
    }
  }

  const actorImage = `https://avatars.githubusercontent.com/${context.actor}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`
  const workflowStr = `*<${repoUrl}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`

  return {
    color: inputs.isSuccess ? '#2eb67d' : '#e01e5a',
    fallback: composeNotificationText(context, inputs),
    footer_icon: actorImage,
    footer: `${actorLink} using workflow ${workflowStr}`,
    mrkdwn_in: ['text', 'footer'],
    text: `${titleStr}\n${bodyStr}`,
    actions: composeActionsBlock(context, inputs).elements.map(action => ({
      type: 'button',
      text: action.text.text,
      style: action.style,
      url: action.url,
    })),
  }
}

export function compose(context: Context, inputs: Inputs) {
  if (inputs.isVerbose) {
    return {
      attachments: [
        composeBodyAttachment(context, inputs),
      ],
    }
  }
  else {
    return {
      text: composeNotificationText(context, inputs),
      blocks: [
        composeBodyBlock(context, inputs),
        composeActionsBlock(context, inputs),
      ],
    }
  }
}

function prefix(value?: string) {
  if (value === undefined || value === null || value === '') return ''

  return `${value} `
}
