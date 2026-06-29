import * as core from '@actions/core';
import * as github from '@actions/github';
import ansiStyles from 'ansi-styles';
import { sendMessage } from './core/sendMessage.js';
import { compose } from './utils/compose.js';
import { getContext, resolveActorAvatarURL } from './utils/context.js';
import { getInputs } from './utils/inputs.js';
async function main() {
    const baseContext = getContext();
    const actorAvatarURL = await resolveActorAvatarURL(baseContext.actor);
    const context = { ...baseContext, actorAvatarURL };
    const inputs = getInputs();
    const message = compose(context, inputs);
    try {
        core.info('Sending message to Slack...');
        core.debug(`context=${JSON.stringify(github.context, undefined, 2)}`);
        core.debug(`payload=${JSON.stringify(message, undefined, 2)}`);
        const res = await sendMessage(message, {
            webhookURL: inputs.webhookURL,
        });
        core.info(`Sending message to Slack... ${ansiStyles.green}OK${ansiStyles.reset}: response=${res}`);
    }
    catch (err) {
        core.error(`Failed to send message to Slack: ${err}`);
        core.setFailed(`Action failed with error from Slack API: ${err}`);
    }
}
main();
