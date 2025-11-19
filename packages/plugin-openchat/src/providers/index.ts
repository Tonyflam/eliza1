import type {
    Provider,
    ProviderResult,
    IAgentRuntime,
    Memory,
    State,
} from '../core-types.js';
import { OpenChatService } from '../services/index.js';

/**
 * Provider for OpenChat user and group context
 */
export const openChatContextProvider: Provider = {
    name: 'OPENCHAT_CONTEXT',
    description: 'Provides context about the agent\'s OpenChat groups, chats, and recent activity',

    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State | undefined
    ): Promise<ProviderResult> => {
        try {
            const service = runtime.getService('openchat') as OpenChatService;
            const client = service?.getClient();

            if (!client || !service?.isInitialized()) {
                return {
                    text: 'OpenChat service is not initialized',
                    values: { initialized: false },
                    data: {},
                };
            }

            // Get user's groups and direct chats
            const groups = await client.getGroups();
            const directChats = await client.getDirectChats();
            const communities = await client.getCommunities();

            const contextText = `OpenChat Status:
- Direct Chats: ${directChats.length}
- Groups: ${groups.length}
- Communities: ${communities.length}
- User ID: ${client.getUserId()}`;

            return {
                text: contextText,
                values: {
                    initialized: true,
                    directChatsCount: directChats.length,
                    groupsCount: groups.length,
                    communitiesCount: communities.length,
                    userId: client.getUserId(),
                },
                data: {
                    groups,
                    directChats,
                    communities,
                },
            };
        } catch (error) {
            console.error('Error in OpenChat context provider:', error);
            return {
                text: 'Error retrieving OpenChat context',
                values: { error: true },
                data: {},
            };
        }
    },
};

/**
 * Provider for OpenChat capabilities
 */
export const openChatCapabilitiesProvider: Provider = {
    name: 'OPENCHAT_CAPABILITIES',
    description: 'Provides information about what the agent can do on OpenChat',

    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State | undefined
    ): Promise<ProviderResult> => {
        const service = runtime.getService('openchat') as OpenChatService;
        const isInitialized = service?.isInitialized() ?? false;

        const capabilities = `OpenChat Capabilities:
${isInitialized ? '✓' : '✗'} Send and receive messages
${isInitialized ? '✓' : '✗'} React to messages with emojis
${isInitialized ? '✓' : '✗'} Create and join groups
${isInitialized ? '✓' : '✗'} Moderate groups (kick, ban, delete messages)
${isInitialized ? '✓' : '✗'} Send and receive tokens (ICP, CHAT, etc.)
${isInitialized ? '✓' : '✗'} Search for users and groups
${isInitialized ? '✓' : '✗'} Pin important messages
${isInitialized ? '✓' : '✗'} Real-time notifications via WebSocket`;

        return {
            text: capabilities,
            values: {
                initialized: isInitialized,
                canMessage: isInitialized,
                canModerate: isInitialized,
                canTrade: isInitialized,
            },
            data: {
                actions: [
                    'SEND_OPENCHAT_MESSAGE',
                    'REPLY_OPENCHAT_MESSAGE',
                    'ADD_OPENCHAT_REACTION',
                    'KICK_OPENCHAT_USER',
                    'BAN_OPENCHAT_USER',
                    'DELETE_OPENCHAT_MESSAGE',
                    'PIN_OPENCHAT_MESSAGE',
                    'JOIN_OPENCHAT_GROUP',
                    'CREATE_OPENCHAT_GROUP',
                    'SEARCH_OPENCHAT',
                    'SEND_OPENCHAT_TOKENS',
                    'CHECK_OPENCHAT_BALANCE',
                ],
            },
        };
    },
};
