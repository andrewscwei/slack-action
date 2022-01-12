import { Context } from './context'
import { Inputs } from './inputs'

export function composeNotificationText(context: Context, inputs: Inputs) {
  if (inputs.isSuccess) {
    return `${inputs.prefixes.success} BUILD PASSED in ${context.repo}`
  }
  else {
    return `${inputs.prefixes.failure} BUILD FAILED in ${context.repo}`
  }
}

export function composeStatusBlock(context: Context, inputs: Inputs) {
  let statusStr = ''

  if (inputs.isSuccess) {
    statusStr += `${inputs.prefixes.success} *BUILD PASSED*`
  }
  else {
    statusStr += `${inputs.prefixes.failure} *BUILD FAILED*`
  }

  const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
  const refName = matches?.[1] ?? context.ref

  const repoUrl = `https://github.com/${context.repo}`

  const repoStr = `<${repoUrl}|${context.repo}>`
  const refStr = `<${repoUrl}/tree/${refName}|${refName}>`

  statusStr += ` in ${repoStr} \`${refStr}\``

  return {
    'type': 'section',
    'text': {
      'type': 'mrkdwn',
      'text': statusStr,
    },
  }
}

export function composeActorBlock(context: Context, inputs: Inputs) {
  return {
    'type': 'context',
    'elements': [
      {
        'type': 'image',
        'image_url': `https://avatars.githubusercontent.com/${context.actor}`,
        'alt_text': context.actor,
      },
      {
        'type': 'mrkdwn',
        'text': `<https://github.com/${context.actor}|${context.actor}>`,
      },
    ],
  }
}

export function composeBodyBlock(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const commitStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``

  return {
    'type': 'section',
    'text': {
      'type': 'mrkdwn',
      'text': `- ${commitStr} ${context.commitMessage}`,
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

export function composeAttachment(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const shaStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``
  const workflowStr = `*<${repoUrl}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`

  return {
    'color': inputs.isSuccess ? '#2eb67d' : '#e01e5a',
    'author_name': context.actor,
    'author_icon': `https://avatars.githubusercontent.com/${context.actor}`,
    'author_link': `https://github.com/${context.actor}`,
    'text': context.commitMessage,
    'footer': `${shaStr} Using workflow ${workflowStr}`,
    'footer_icon': 'https://slack-imgs.com/?c=1&o1=wi32.he32.si&url=https%3A%2F%2Fslack.github.com%2Fstatic%2Fimg%2Ffavicon-neutral.png',
    'mrkdwn_in': ['text', 'footer'],
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
      'text': composeNotificationText(context, inputs),
      'blocks': [
        composeStatusBlock(context, inputs),
      ],
      'attachments': [
        composeAttachment(context, inputs),
      ],
    }
  }
  else {
    return {
      'text': composeNotificationText(context, inputs),
      'blocks': [
        composeStatusBlock(context, inputs),
        composeBodyBlock(context, inputs),
        composeActorBlock(context, inputs),
        composeActionsBlock(context, inputs),
      ],
    }
  }
}
