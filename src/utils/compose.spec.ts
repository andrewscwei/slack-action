import { assert } from 'chai'
import { describe, it } from 'mocha'
import { compose, composeActionsBlock, composeBodyBlock, composeStatusBlock } from './compose'
import { getContext } from './context'
import { getInputs } from './inputs'

describe('compose', () => {
  const mockContext = getContext({
    actor: 'foo',
    ref: 'foo',
    repo: 'foo',
    runId: 'foo',
    sha: 'foo',
    workflow: 'foo',
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

  it('can compose status block', () => {
    assert.ok(composeStatusBlock(mockContext, mockSuccessInputs))
    assert.ok(composeStatusBlock(mockContext, mockFailureInputs))
  })

  it('can compose body block', () => {
    assert.ok(composeBodyBlock(mockContext, mockSuccessInputs))
    assert.ok(composeBodyBlock(mockContext, mockFailureInputs))
  })

  it('can compose actions block', () => {
    assert(composeActionsBlock(mockContext, mockSuccessInputs).elements.length === 2)
    assert(composeActionsBlock(mockContext, mockFailureInputs).elements.length === 1)
  })

  it('can compose full message', () => {
    const message = compose(mockContext, mockSuccessInputs)
    assert.ok(message)
  })
})
