import { assert } from 'chai';
import { describe, it } from 'mocha';
import { compose, composeActions, composeBodyAttachment } from './compose.js';
import { getContext } from './context.js';
import { getInputs } from './inputs.js';
describe('compose', () => {
    const mockContext = getContext({
        ref: 'foo',
        actor: 'foo',
        eventName: 'push',
        repo: 'foo',
        runId: 'foo',
        sha: 'foo',
        workflow: 'foo',
    });
    const mockSuccessInputs = getInputs({
        action: { label: 'bar', url: 'baz' },
        prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
        webhookURL: 'foo',
        isSuccess: true,
    });
    const mockFailureInputs = getInputs({
        action: { label: 'bar', url: 'baz' },
        prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
        webhookURL: 'foo',
        isSuccess: false,
    });
    it('can compose body attachment', () => {
        assert.ok(composeBodyAttachment(mockContext, mockSuccessInputs));
        assert.ok(composeBodyAttachment(mockContext, mockFailureInputs));
    });
    it('can compose actions block', () => {
        assert(composeActions(mockContext, mockSuccessInputs).elements.length === 2);
        assert(composeActions(mockContext, mockFailureInputs).elements.length === 1);
    });
    it('can compose full message', () => {
        const message = compose(mockContext, mockSuccessInputs);
        assert.ok(message);
    });
    it('uses /apps/ link and resolved avatar url when actor is a bot', () => {
        const botContext = getContext({
            ref: 'foo',
            actor: 'my-app[bot]',
            actorAvatarURL: 'https://avatars.githubusercontent.com/in/42?v=4',
            eventName: 'push',
            repo: 'foo',
            runId: 'foo',
            sha: 'foo',
            workflow: 'foo',
        });
        const attachment = composeBodyAttachment(botContext, mockSuccessInputs);
        assert.equal(attachment.footer_icon, 'https://avatars.githubusercontent.com/in/42?v=4');
        assert.include(attachment.footer, 'https://github.com/apps/my-app');
        assert.notInclude(attachment.footer, 'https://github.com/my-app[bot]');
    });
});
