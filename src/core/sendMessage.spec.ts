import { describe, it } from 'mocha'

import { sendMessage } from './sendMessage.js'

describe('sendMessage', () => {
  const webhookURL = process.env.WEBHOOK_URL || undefined

  if (webhookURL) {
    it('can send message', async () => {
      await sendMessage({
        text: 'Hello, world!',
      }, {
        webhookURL,
      })
    })
  }
})
