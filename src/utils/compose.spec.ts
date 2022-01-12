import { assert } from 'chai'
import { describe, it } from 'mocha'
import { compose, composeBody, composeButtons, composeStatus } from './compose'
import { getContext } from './context'
import { getInputs } from './inputs'

describe('compose', () => {
  const mockContext = getContext({
    actor: 'foo',
    ref: 'foo',
    repo: 'foo',
    runId: 'foo',
    serverUrl: 'foo',
    sha: 'foo',
  })

  const mockSuccessInputs = getInputs({
    prefixes: { success: 'bar', failure: 'baz' },
    isSuccess: true,
    webhookUrl: 'foo',
    action: { label: 'bar', url: 'baz' },
  })

  const mockFailureInputs = getInputs({
    prefixes: { success: 'bar', failure: 'baz' },
    isSuccess: false,
    webhookUrl: 'foo',
    action: { label: 'bar', url: 'baz' },
  })

  it('can compose status', () => {
    assert.isString(composeStatus(mockContext, mockSuccessInputs))
    assert.isString(composeStatus(mockContext, mockFailureInputs))
  })

  it('can compose body', () => {
    assert.isString(composeBody(mockContext, mockSuccessInputs))
    assert.isString(composeBody(mockContext, mockFailureInputs))
  })

  it('can compose buttons', () => {
    assert(composeButtons(mockContext, mockSuccessInputs).length === 2)
    assert(composeButtons(mockContext, mockFailureInputs).length === 1)
  })

  it('can compose full message', () => {
    const message = compose(mockContext, mockSuccessInputs)
    assert.ok(message)
  })
})
