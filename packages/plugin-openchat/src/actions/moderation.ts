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
 * Action to kick a user from a group
 */
export const kickUserAction: Action = {
    name: 'KICK_OPENCHAT_USER',
    similes: ['OPENCHAT_KICK', 'REMOVE_OC_USER', 'KICK_USER'],
    description: 'Kick a user from an OpenChat group or community',

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

            // Parse: "kick [userId] from [chatId]"
            const match = text.match(/kick ([^\s]+) from (.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: kick [userId] from [chatId]');
            }

            const userId = match[1].trim();
            const chatId = match[2].trim();

            // Kick the user
            await client.kickUser(chatId, userId);

            const response = `User ${userId} kicked from ${chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['KICK_OPENCHAT_USER'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    userId,
                    chatId,
                    actions: ['KICK_OPENCHAT_USER'],
                },
            };
        } catch (error) {
            console.error('Error kicking user:', error);
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
                    text: 'kick user789 from group123',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'User user789 kicked from group123',
                    actions: ['KICK_OPENCHAT_USER'],
                },
            },
        ],
    ],
};

/**
 * Action to ban a user from a group
 */
export const banUserAction: Action = {
    name: 'BAN_OPENCHAT_USER',
    similes: ['OPENCHAT_BAN', 'BAN_OC_USER', 'BLOCK_USER'],
    description: 'Ban a user from an OpenChat group or community',

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

            // Parse: "ban [userId] from [chatId]"
            const match = text.match(/ban ([^\s]+) from (.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: ban [userId] from [chatId]');
            }

            const userId = match[1].trim();
            const chatId = match[2].trim();

            // Ban the user
            await client.banUser(chatId, userId);

            const response = `User ${userId} banned from ${chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['BAN_OPENCHAT_USER'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    userId,
                    chatId,
                    actions: ['BAN_OPENCHAT_USER'],
                },
            };
        } catch (error) {
            console.error('Error banning user:', error);
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
                    text: 'ban spammer123 from group123',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'User spammer123 banned from group123',
                    actions: ['BAN_OPENCHAT_USER'],
                },
            },
        ],
    ],
};

/**
 * Action to delete a message
 */
export const deleteMessageAction: Action = {
    name: 'DELETE_OPENCHAT_MESSAGE',
    similes: ['OPENCHAT_DELETE', 'REMOVE_OC_MESSAGE', 'DELETE_MESSAGE'],
    description: 'Delete a message from OpenChat (requires moderator permissions)',

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

            // Parse: "delete message [messageId] from [chatId]"
            const match = text.match(/delete message ([^\s]+) from (.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: delete message [messageId] from [chatId]');
            }

            const messageId = BigInt(match[1].trim());
            const chatId = match[2].trim();

            // Delete the message
            await client.deleteMessage(chatId, messageId);

            const response = `Message ${messageId} deleted from ${chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['DELETE_OPENCHAT_MESSAGE'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    messageId: messageId.toString(),
                    chatId,
                    actions: ['DELETE_OPENCHAT_MESSAGE'],
                },
            };
        } catch (error) {
            console.error('Error deleting message:', error);
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
                    text: 'delete message 12345 from group123',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Message 12345 deleted from group123',
                    actions: ['DELETE_OPENCHAT_MESSAGE'],
                },
            },
        ],
    ],
};

/**
 * Action to pin a message
 */
export const pinMessageAction: Action = {
    name: 'PIN_OPENCHAT_MESSAGE',
    similes: ['OPENCHAT_PIN', 'PIN_OC_MESSAGE', 'PIN_MESSAGE'],
    description: 'Pin an important message in an OpenChat group',

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

            // Parse: "pin message [messageId] in [chatId]"
            const match = text.match(/pin message ([^\s]+) in (.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: pin message [messageId] in [chatId]');
            }

            const messageId = BigInt(match[1].trim());
            const chatId = match[2].trim();

            // Pin the message
            await client.pinMessage(chatId, messageId);

            const response = `Message ${messageId} pinned in ${chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['PIN_OPENCHAT_MESSAGE'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    messageId: messageId.toString(),
                    chatId,
                    actions: ['PIN_OPENCHAT_MESSAGE'],
                },
            };
        } catch (error) {
            console.error('Error pinning message:', error);
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
                    text: 'pin message 12345 in group123',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Message 12345 pinned in group123',
                    actions: ['PIN_OPENCHAT_MESSAGE'],
                },
            },
        ],
    ],
};
