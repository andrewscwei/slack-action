import { Context } from './context'
import { Inputs } from './inputs'

export function composeStatus(context: Context, inputs: Inputs) {
  if (inputs.isSuccess) {
    return `${inputs.prefixes.success} BUILD PASSED in ${context.repo}`
  }
  else {
    return `${inputs.prefixes.failure} BUILD FAILED in ${context.repo}`
  }
}

export function composeBody(context: Context, inputs: Inputs) {
  const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
  const refName = matches?.[1] ?? context.ref

  let out = ''

  const repoUrl = `${context.serverUrl}/${context.repo}`

  const statusStr = composeStatus(context, inputs)
  const repoStr = `<${repoUrl}|${context.repo}>`
  const refStr = `<${repoUrl}/tree/${refName}|${refName}>`
  const actorStr = `<${context.serverUrl}/${context.actor}|${context.actor}>`
  const commitStr = `<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>`

  out += `${statusStr} in ${repoStr} \`${refStr}\` by ${actorStr}`
  out += '\n'
  out += `- \`${commitStr}\` ${context.commitMessage}`

  return out
}

export function composeButtons(context: Context, inputs: Inputs) {
  const repoUrl = `${context.serverUrl}/${context.repo}`
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

  return buttons
}

export function compose(context: Context, inputs: Inputs) {
  const status = composeStatus(context, inputs)
  const body = composeBody(context, inputs)
  const buttons = composeButtons(context, inputs)

  return {
    'text': status,
    'blocks': [{
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': body,
      },
    }, {
      'type': 'actions',
      'elements': buttons,
    }],
  }
}

