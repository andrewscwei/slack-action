import * as core from '@actions/core'
import { sendMessage } from './core/sendMessage.js'
import { compose } from './utils/compose.js'
import { getContext } from './utils/context.js'
import { getInputs } from './utils/inputs.js'

async function main() {
  const context = getContext()
  const inputs = getInputs()
  const message = compose(context, inputs)

  core.info('Sending message via Slack API:')
  core.info(JSON.stringify(message, undefined, 2))

  return sendMessage(message, {
    webhookUrl: inputs.webhookUrl,
  })
}

main()
  .then(res => {
    core.info(`Slack API response: ${res}`)
    core.setOutput('response', res)
  })
  .catch(err => {
    core.setFailed(`Slack API error: ${err.message}`)
  })
