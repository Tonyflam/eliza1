import type {
    Action,
    ActionResult,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from '../core-types.js';
import { OpenChatService } from '../services/index.js';

/**
 * Action to send a message to OpenChat
 */
export const sendMessageAction: Action = {
    name: 'SEND_OPENCHAT_MESSAGE',
    similes: ['OPENCHAT_SEND', 'SEND_OC_MESSAGE', 'MESSAGE_OPENCHAT'],
    description: 'Send a message to an OpenChat user, group, or community channel',

    validate: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State | undefined
    ): Promise<boolean> => {
        const service = runtime.getService('openchat') as OpenChatService;
        return service?.isInitialized() ?? false;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        _state: State | undefined,
        _options: any,
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        try {
            const service = runtime.getService('openchat') as OpenChatService;
            const client = service?.getClient();

            if (!client) {
                throw new Error('OpenChat service not initialized');
            }

            // Extract chat ID and message from the content
            const content = message.content as Content;
            const text = content.text;

            // Parse the message to extract chatId and message content
            // Format: "send to [chatId]: [message]"
            const match = text.match(/send to ([^:]+):\s*(.+)/i);
            
            if (!match) {
                throw new Error('Invalid message format. Use: send to [chatId]: [message]');
            }

            const chatId = match[1].trim();
            const messageText = match[2].trim();

            // Send the message
            const sentMessage = await client.sendMessage({
                chatId,
                content: messageText,
            });

            const response = `Message sent successfully to ${chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['SEND_OPENCHAT_MESSAGE'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    messageId: sentMessage.messageId.toString(),
                    chatId,
                    actions: ['SEND_OPENCHAT_MESSAGE'],
                },
            };
        } catch (error) {
            console.error('Error sending OpenChat message:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },

    examples: [
        [
            {
                name: '{{userName}}',
                content: {
                    text: 'send to group123: Hello everyone!',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Message sent successfully to group123',
                    actions: ['SEND_OPENCHAT_MESSAGE'],
                },
            },
        ],
        [
            {
                name: '{{userName}}',
                content: {
                    text: 'send a message to user456 saying welcome to the community',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Message sent successfully to user456',
                    actions: ['SEND_OPENCHAT_MESSAGE'],
                },
            },
        ],
    ],
};

/**
 * Action to reply to a message on OpenChat
 */
export const replyMessageAction: Action = {
    name: 'REPLY_OPENCHAT_MESSAGE',
    similes: ['OPENCHAT_REPLY', 'REPLY_OC_MESSAGE'],
    description: 'Reply to a specific message on OpenChat',

    validate: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State | undefined
    ): Promise<boolean> => {
        const service = runtime.getService('openchat') as OpenChatService;
        return service?.isInitialized() ?? false;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        _state: State | undefined,
        _options: any,
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        try {
            const service = runtime.getService('openchat') as OpenChatService;
            const client = service?.getClient();

            if (!client) {
                throw new Error('OpenChat service not initialized');
            }

            const content = message.content as Content;
            const text = content.text;

            // Parse: "reply to [messageId] in [chatId]: [message]"
            const match = text.match(/reply to ([^\s]+) in ([^:]+):\s*(.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: reply to [messageId] in [chatId]: [message]');
            }

            const messageId = BigInt(match[1].trim());
            const chatId = match[2].trim();
            const replyText = match[3].trim();

            // Send the reply
            const sentMessage = await client.sendMessage({
                chatId,
                content: replyText,
                replyTo: messageId,
            });

            const response = `Reply sent successfully to message ${messageId} in ${chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['REPLY_OPENCHAT_MESSAGE'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    messageId: sentMessage.messageId.toString(),
                    replyTo: messageId.toString(),
                    chatId,
                    actions: ['REPLY_OPENCHAT_MESSAGE'],
                },
            };
        } catch (error) {
            console.error('Error replying to OpenChat message:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },

    examples: [
        [
            {
                name: '{{userName}}',
                content: {
                    text: 'reply to 12345 in group123: Thanks for the info!',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Reply sent successfully to message 12345 in group123',
                    actions: ['REPLY_OPENCHAT_MESSAGE'],
                },
            },
        ],
    ],
};

/**
 * Action to add a reaction to a message
 */
export const addReactionAction: Action = {
    name: 'ADD_OPENCHAT_REACTION',
    similes: ['OPENCHAT_REACT', 'REACT_OC_MESSAGE', 'ADD_OC_EMOJI'],
    description: 'Add a reaction/emoji to a message on OpenChat',

    validate: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State | undefined
    ): Promise<boolean> => {
        const service = runtime.getService('openchat') as OpenChatService;
        return service?.isInitialized() ?? false;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        _state: State | undefined,
        _options: any,
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        try {
            const service = runtime.getService('openchat') as OpenChatService;
            const client = service?.getClient();

            if (!client) {
                throw new Error('OpenChat service not initialized');
            }

            const content = message.content as Content;
            const text = content.text;

            // Parse: "react [emoji] to [messageId] in [chatId]"
            const match = text.match(/react ([^\s]+) to ([^\s]+) in (.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: react [emoji] to [messageId] in [chatId]');
            }

            const reaction = match[1].trim();
            const messageId = BigInt(match[2].trim());
            const chatId = match[3].trim();

            // Add the reaction
            await client.addReaction(chatId, messageId, reaction);

            const response = `Reaction ${reaction} added to message ${messageId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['ADD_OPENCHAT_REACTION'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    reaction,
                    messageId: messageId.toString(),
                    chatId,
                    actions: ['ADD_OPENCHAT_REACTION'],
                },
            };
        } catch (error) {
            console.error('Error adding reaction:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },

    examples: [
        [
            {
                name: '{{userName}}',
                content: {
                    text: 'react 👍 to 12345 in group123',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Reaction 👍 added to message 12345',
                    actions: ['ADD_OPENCHAT_REACTION'],
                },
            },
        ],
    ],
};
