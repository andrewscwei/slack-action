import fetch from 'node-fetch'

export async function sendMessage(message: Record<string, any>, { webhookUrl = '' } = {}) {
  const url = new URL(webhookUrl)

  const res = await fetch(url, {
    body: JSON.stringify(message),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  switch (res.status) {
    case 200:
      return res.text()
    default: {
      throw await res.text()
    }
  }
}
