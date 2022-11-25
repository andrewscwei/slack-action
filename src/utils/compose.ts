import _ from 'lodash'
import { Context } from './context'
import { Inputs } from './inputs'

function prefix(value?: string) {
  if (_.isEmpty(value)) return ''

  return `${value} `
}

export function composeNotificationText(context: Context, inputs: Inputs) {
  if (inputs.isSuccess) {
    return `${prefix(inputs.prefixes.success)}BUILD PASSED in ${context.repo}`
  }
  else {
    return `${prefix(inputs.prefixes.failure)}BUILD FAILED in ${context.repo}`
  }
}

export function composeStatusText(context: Context, inputs: Inputs) {
  let statusStr = ''

  if (inputs.isSuccess) {
    statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`
  }
  else {
    statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`
  }

  const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
  const refName = matches?.[1] ?? context.ref

  const repoUrl = `https://github.com/${context.repo}`

  const repoStr = `<${repoUrl}|${context.repo}>`
  const refStr = `<${repoUrl}/tree/${refName}|${refName}>`

  statusStr += ` in ${repoStr} \`${refStr}\``

  return statusStr
}

export function composeActorBlock(context: Context, inputs: Inputs) {
  const actorImage = `https://avatars.githubusercontent.com/${context.actor}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`

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
  }
}

export function composeBodyBlock(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`
  const commitStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``

  return {
    'type': 'section',
    'text': {
      'type': 'mrkdwn',
      'text': `${composeStatusText(context, inputs)}\n- ${context.commitMessage} (${commitStr} by ${actorLink})`,
    },
  }
}

export function composeActionsBlock(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const jobUrl = `${repoUrl}/actions/runs/${context.runId}`
  const buttons = []

  buttons.push({
    'type': 'button',
    'text': {
      'type': 'plain_text',
      'text': 'View job',
      'emoji': true,
    },
    'url': jobUrl,
    ...inputs.isSuccess ? {} : { style: 'danger' },
  })

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
    })
  }

  return {
    'type': 'actions',
    'elements': buttons,
  }
}

export function composeBodyAttachment(context: Context, inputs: Inputs) {
  let titleStr = ''

  if (inputs.isSuccess) {
    titleStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`
  }
  else {
    titleStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`
  }

  const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
  const refName = matches?.[1] ?? context.ref

  const actorImage = `https://avatars.githubusercontent.com/${context.actor}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`
  const repoUrl = `https://github.com/${context.repo}`
  const repoStr = `<${repoUrl}|${context.repo}>`
  const refStr = `<${repoUrl}/tree/${refName}|${refName}>`
  const shaStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``
  const workflowStr = `*<${repoUrl}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`

  titleStr += ` in ${repoStr} \`${refStr}\``

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
  }
}

export function compose(context: Context, inputs: Inputs) {
  if (inputs.isVerbose) {
    return {
      'attachments': [
        composeBodyAttachment(context, inputs),
      ],
    }
  }
  else {
    return {
      'text': composeNotificationText(context, inputs),
      'blocks': [
        composeBodyBlock(context, inputs),
        composeActionsBlock(context, inputs),
      ],
    }
  }
}
