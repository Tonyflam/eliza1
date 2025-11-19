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
 * Action to join a group
 */
export const joinGroupAction: Action = {
    name: 'JOIN_OPENCHAT_GROUP',
    similes: ['OPENCHAT_JOIN', 'JOIN_OC_GROUP', 'JOIN_COMMUNITY'],
    description: 'Join an OpenChat group or community',

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

            // Parse: "join group [groupId]"
            const match = text.match(/join (?:group|community) (.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: join group [groupId]');
            }

            const groupId = match[1].trim();

            // Join the group
            await client.joinGroup(groupId);

            const response = `Successfully joined group ${groupId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['JOIN_OPENCHAT_GROUP'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    groupId,
                    actions: ['JOIN_OPENCHAT_GROUP'],
                },
            };
        } catch (error) {
            console.error('Error joining group:', error);
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
                    text: 'join group trading-signals',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Successfully joined group trading-signals',
                    actions: ['JOIN_OPENCHAT_GROUP'],
                },
            },
        ],
    ],
};

/**
 * Action to create a group
 */
export const createGroupAction: Action = {
    name: 'CREATE_OPENCHAT_GROUP',
    similes: ['OPENCHAT_CREATE', 'CREATE_OC_GROUP', 'NEW_GROUP'],
    description: 'Create a new OpenChat group',

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

            // Parse: "create group [name] with description [description] [public|private]"
            const match = text.match(/create group ([^:]+)(?::?\s*(?:with description|description)?\s*([^(]*))?\s*\(?(public|private)?\)?/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: create group [name] with description [description] (public|private)');
            }

            const name = match[1].trim();
            const description = match[2]?.trim() || '';
            const isPublic = match[3]?.toLowerCase() === 'public';

            // Create the group
            const group = await client.createGroup(name, description, isPublic);

            const response = `Successfully created ${isPublic ? 'public' : 'private'} group "${name}" with ID: ${group.chatId}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['CREATE_OPENCHAT_GROUP'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    groupId: group.chatId,
                    name,
                    isPublic,
                    actions: ['CREATE_OPENCHAT_GROUP'],
                },
            };
        } catch (error) {
            console.error('Error creating group:', error);
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
                    text: 'create group Trading Signals with description Daily crypto trading signals (public)',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Successfully created public group "Trading Signals" with ID: group_1234567890',
                    actions: ['CREATE_OPENCHAT_GROUP'],
                },
            },
        ],
    ],
};

/**
 * Action to search for groups or users
 */
export const searchAction: Action = {
    name: 'SEARCH_OPENCHAT',
    similes: ['OPENCHAT_SEARCH', 'FIND_OC', 'SEARCH_GROUPS'],
    description: 'Search for users, groups, or messages on OpenChat',

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

            // Parse: "search for [query]" or "search users/groups [query]"
            const match = text.match(/search (?:for )?(users?|groups?|messages?)?\s*(.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: search [query] or search users/groups/messages [query]');
            }

            const type = match[1]?.toLowerCase();
            const query = match[2].trim();

            // Perform search
            const results = await client.search({
                query,
                searchUsers: !type || type.startsWith('user'),
                searchGroups: !type || type.startsWith('group'),
                searchMessages: type?.startsWith('message'),
                maxResults: 10,
            });

            let response = `Search results for "${query}":\n`;
            if (results.users?.length) {
                response += `\nUsers: ${results.users.length} found`;
            }
            if (results.groups?.length) {
                response += `\nGroups: ${results.groups.length} found`;
            }
            if (results.messages?.length) {
                response += `\nMessages: ${results.messages.length} found`;
            }

            if (callback) {
                await callback({
                    text: response,
                    actions: ['SEARCH_OPENCHAT'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    query,
                    results,
                    actions: ['SEARCH_OPENCHAT'],
                },
            };
        } catch (error) {
            console.error('Error searching:', error);
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
                    text: 'search for crypto trading',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Search results for "crypto trading":\nGroups: 5 found',
                    actions: ['SEARCH_OPENCHAT'],
                },
            },
        ],
    ],
};
