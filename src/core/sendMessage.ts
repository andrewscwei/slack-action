import axios from 'axios'

export async function sendMessage(message: Record<string, any>, { webhookUrl = '' } = {}) {
  return axios.post(webhookUrl, message, {
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
