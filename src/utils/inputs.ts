import * as core from '@actions/core'
import assert from 'assert'

export type Inputs = {
  prefixes: {
    success: string
    failure: string
    cancelled: string
  }
  webhookUrl: string
  isSuccess: boolean
  isCancelled: boolean
  isVerbose: boolean
  action?: {
    label: string
    url: string
  }
}

export function getStringInput(id: string, defaultValue?: string): string {
  try {
    const input = core.getInput(id, { required: true, trimWhitespace: true })

    return input
  }
  catch (err) {
    if (defaultValue !== undefined) return defaultValue
    throw Error(`Required string input with ID <${id}> is not provided`)
  }
}

export function getBooleanInput(id: string, defaultValue?: boolean): boolean {
  try {
    const input = core.getBooleanInput(id, { required: true })

    return input
  }
  catch (err) {
    if (defaultValue !== undefined) return defaultValue
    throw Error(`Required boolean input with ID <${id}> is not provided`)
  }
}

export function getInputs(mock?: Partial<Inputs>): Inputs {
  const successPrefix = mock?.prefixes?.success ?? getStringInput('success-prefix', '🤖')
  const failurePrefix = mock?.prefixes?.failure ?? getStringInput('failure-prefix', '😱')
  const cancelledPrefix = mock?.prefixes?.cancelled ?? getStringInput('cancelled-prefix', '🫥')
  const webhookUrl = mock?.webhookUrl ?? getStringInput('webhook-url')
  const isSuccess = mock?.isSuccess ?? getBooleanInput('success', false)
  const isCancelled = mock?.isCancelled ?? getBooleanInput('cancelled', false)
  const isVerbose = mock?.isVerbose ?? getBooleanInput('verbose', true)
  const actionLabel = mock?.action?.label ?? getStringInput('action-label', '')
  const actionUrl = mock?.action?.url ?? getStringInput('action-url', '')
  const hasAction = actionLabel !== '' && actionUrl !== ''
  const hasNoAction = !isSuccess || actionLabel === '' && actionUrl === ''

  assert(hasAction || hasNoAction, Error('Both <action-label> and <action-url> inputs must be provided'))

  return {
    prefixes: {
      success: successPrefix,
      failure: failurePrefix,
      cancelled: cancelledPrefix,
    },
    webhookUrl,
    isSuccess,
    isCancelled,
    isVerbose,
    ...hasAction ? {
      action: {
        label: actionLabel,
        url: actionUrl,
      },
    } : {},
  }
}
