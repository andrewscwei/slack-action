import { assert } from 'chai';
import { describe, it } from 'mocha';
import { compose, composeActionsBlock, composeBodyAttachment, composeBodyBlock } from './compose.js';
import { getContext } from './context.js';
import { getInputs } from './inputs.js';
describe('compose', () => {
    const mockContext = getContext({
        actor: 'foo',
        ref: 'foo',
        repo: 'foo',
        runId: 'foo',
        sha: 'foo',
        workflow: 'foo',
    });
    const mockSuccessInputs = getInputs({
        prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
        isSuccess: true,
        webhookUrl: 'foo',
        action: { label: 'bar', url: 'baz' },
    });
    const mockFailureInputs = getInputs({
        prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
        isSuccess: false,
        webhookUrl: 'foo',
        action: { label: 'bar', url: 'baz' },
    });
    it('can compose body block', () => {
        assert.ok(composeBodyBlock(mockContext, mockSuccessInputs));
        assert.ok(composeBodyBlock(mockContext, mockFailureInputs));
    });
    it('can compose body attachment', () => {
        assert.ok(composeBodyAttachment(mockContext, mockSuccessInputs));
        assert.ok(composeBodyAttachment(mockContext, mockFailureInputs));
    });
    it('can compose actions block', () => {
        assert(composeActionsBlock(mockContext, mockSuccessInputs).elements.length === 2);
        assert(composeActionsBlock(mockContext, mockFailureInputs).elements.length === 1);
    });
    it('can compose full message', () => {
        const message = compose(mockContext, mockSuccessInputs);
        assert.ok(message);
    });
});
