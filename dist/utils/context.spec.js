import { assert } from 'chai';
import { describe, it } from 'mocha';
import { getContext } from './context.js';
describe('context', () => {
    it('can get context with custom values', () => {
        assert.deepEqual(getContext({
            ref: 'foo',
            actor: 'foo',
            commitMessage: 'foo',
            eventName: 'push',
            repo: 'foo',
            runId: 'foo',
            sha: 'foo',
            workflow: 'foo',
        }), {
            ref: 'foo',
            actor: 'foo',
            commitMessage: 'foo',
            eventName: 'push',
            repo: 'foo',
            runId: 'foo',
            sha: 'foo',
            workflow: 'foo',
        });
    });
});
