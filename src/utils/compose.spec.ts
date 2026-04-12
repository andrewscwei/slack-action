import { assert } from 'chai'
import { describe, it } from 'mocha'

import { compose, composeActionsBlock, composeBodyAttachment, composeBodyBlock } from './compose.js'
import { getContext } from './context.js'
import { getInputs } from './inputs.js'

describe('compose', () => {
  const mockContext = getContext({
    ref: 'foo',
    actor: 'foo',
    eventName: 'push',
    repo: 'foo',
    runId: 'foo',
    sha: 'foo',
    workflow: 'foo',
  })

  const mockSuccessInputs = getInputs({
    action: { label: 'bar', url: 'baz' },
    prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
    webhookUrl: 'foo',
    isSuccess: true,
  })

  const mockFailureInputs = getInputs({
    action: { label: 'bar', url: 'baz' },
    prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
    webhookUrl: 'foo',
    isSuccess: false,
  })

  it('can compose body block', () => {
    assert.ok(composeBodyBlock(mockContext, mockSuccessInputs))
    assert.ok(composeBodyBlock(mockContext, mockFailureInputs))
  })

  it('can compose body attachment', () => {
    assert.ok(composeBodyAttachment(mockContext, mockSuccessInputs))
    assert.ok(composeBodyAttachment(mockContext, mockFailureInputs))
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
