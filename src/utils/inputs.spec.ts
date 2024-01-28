import { assert } from 'chai'
import { describe, it } from 'mocha'
import { getBooleanInput, getInputs, getStringInput } from './inputs.js'

describe('inputs', () => {
  it('throws when getting nonexistent string inputs without default value', () => {
    assert.throws(() => getStringInput('foo'))
  })

  it('can get string inputs with default values', () => {
    assert.equal(getStringInput('foo', 'foo'), 'foo')
    assert.equal(getStringInput('foo', ''), '')
  })

  it('throws when getting nonexistent boolean inputs without default value', () => {
    assert.throws(() => getBooleanInput('foo'))
  })

  it('can get boolean inputs with default values', () => {
    assert.isTrue(getBooleanInput('foo', true))
    assert.isFalse(getBooleanInput('foo', false))
  })

  it('throws when getting all inputs without any custom values', () => {
    assert.throws(() => getInputs())
  })

  it('can get all inputs with custom values', () => {
    assert.deepEqual(getInputs({
      webhookUrl: 'foo',
    }), {
      prefixes: { success: '🤖', failure: '😱', cancelled: '🫥' },
      webhookUrl: 'foo',
      isSuccess: false,
      isCancelled: false,
      isVerbose: true,
    })

    assert.deepEqual(getInputs({
      prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
      isSuccess: true,
      isVerbose: false,
      webhookUrl: 'foo',
      action: { label: 'bar', url: 'baz' },
    }), {
      prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
      webhookUrl: 'foo',
      isSuccess: true,
      isCancelled: false,
      isVerbose: false,
      action: { label: 'bar', url: 'baz' },
    })
  })
})
