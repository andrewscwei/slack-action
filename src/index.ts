import * as core from '@actions/core'
import axios from 'axios'
import { compose } from './utils/compose'
import { getContext } from './utils/context'
import { getInputs } from './utils/inputs'

async function main() {
  const context = getContext()
  const inputs = getInputs()
  const message = compose(context, inputs)

  core.info('Sending message via Slack API:')
  core.info(JSON.stringify(message, undefined, 2))

  return axios.post(inputs.webhookUrl, message, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then(res => {
      switch (res.status) {
      case 200:
        return res.data
      default:
        throw new Error(res.data)
      }
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
