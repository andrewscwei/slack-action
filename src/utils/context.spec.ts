import { assert } from 'chai'
import { describe, it } from 'mocha'
import { getContext } from './context.js'

describe('context', () => {
  it('can get context with custom values', () => {
    assert.deepEqual(getContext({
      actor: 'foo',
      commitMessage: 'foo',
      ref: 'foo',
      repo: 'foo',
      runId: 'foo',
      sha: 'foo',
      workflow: 'foo',
    }), {
      actor: 'foo',
      commitMessage: 'foo',
      ref: 'foo',
      repo: 'foo',
      runId: 'foo',
      sha: 'foo',
      workflow: 'foo',
    })
  })
})
