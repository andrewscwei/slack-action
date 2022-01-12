import { assert } from 'chai'
import { describe, it } from 'mocha'
import { getContext } from './context'

describe('context', () => {
  it('can get context with custom values', () => {
    assert.deepEqual(getContext({
      actor: 'foo',
      commitMessage: 'foo',
      ref: 'foo',
      repo: 'foo',
      runId: 'foo',
      serverUrl: 'foo',
      sha: 'foo',
    }), {
      actor: 'foo',
      commitMessage: 'foo',
      ref: 'foo',
      repo: 'foo',
      runId: 'foo',
      serverUrl: 'foo',
      sha: 'foo',
    })
  })
})
