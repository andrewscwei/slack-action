import { describe, it } from 'mocha';
import { sendMessage } from './sendMessage.js';
describe('sendMessage', () => {
    const webhookUrl = process.env.WEBHOOK_URL || undefined;
    if (webhookUrl) {
        it('can send message', async () => {
            await sendMessage({
                text: 'Hello, world!',
            }, {
                webhookUrl,
            });
        });
    }
});
