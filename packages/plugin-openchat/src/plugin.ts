import type { Plugin } from './core-types.js';
import { z } from 'zod';
import { OpenChatService } from './services/index.js';
import {
    sendMessageAction,
    replyMessageAction,
    addReactionAction,
    kickUserAction,
    banUserAction,
    deleteMessageAction,
    pinMessageAction,
    joinGroupAction,
    createGroupAction,
    searchAction,
    sendTokensAction,
    checkBalanceAction,
} from './actions/index.js';
import {
    openChatContextProvider,
    openChatCapabilitiesProvider,
} from './providers/index.js';

/**
 * Configuration schema for the OpenChat plugin
 */
const configSchema = z.object({
    OPENCHAT_IDENTITY: z
        .string()
        .min(1, 'OpenChat identity is required')
        .optional(),
    OPENCHAT_USER_ID: z
        .string()
        .min(1, 'OpenChat user ID is required')
        .optional(),
    OPENCHAT_USERNAME: z
        .string()
        .optional(),
    OPENCHAT_API_URL: z
        .string()
        .url()
        .optional()
        .default('https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app'),
});

/**
 * OpenChat Plugin for ElizaOS
 * 
 * This plugin enables agents to interact with the OpenChat platform (oc.app),
 * providing full functionality including:
 * - Sending and receiving messages
 * - Group and community management
 * - User moderation (kick, ban, delete messages)
 * - Token transfers and trading
 * - Real-time notifications via WebSocket
 * 
 * Perfect for creating moderation agents, community managers, trading bots, and more.
 */
export const openChatPlugin: Plugin = {
    name: 'plugin-openchat',
    description: 'OpenChat (oc.app) integration plugin for ElizaOS - enables full agent interaction with OpenChat platform',
    
    config: {
        OPENCHAT_IDENTITY: process.env.OPENCHAT_IDENTITY,
        OPENCHAT_USER_ID: process.env.OPENCHAT_USER_ID,
        OPENCHAT_USERNAME: process.env.OPENCHAT_USERNAME,
        OPENCHAT_API_URL: process.env.OPENCHAT_API_URL || 'https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app',
    },

    async init(config: Record<string, string>) {
        console.log('Initializing OpenChat plugin...');
        
        try {
            const validatedConfig = await configSchema.parseAsync(config);

            // Set environment variables
            for (const [key, value] of Object.entries(validatedConfig)) {
                if (value) {
                    process.env[key] = value;
                }
            }

            console.log('OpenChat plugin initialized successfully');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues?.map((e) => e.message)?.join(', ') || 'Unknown validation error';
                console.warn(`OpenChat plugin configuration warning: ${errorMessages}`);
                console.warn('Plugin will run in limited mode. Some features may not be available.');
            } else {
                throw new Error(
                    `Invalid OpenChat plugin configuration: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        }
    },

    services: [OpenChatService],

    actions: [
        // Message actions
        sendMessageAction,
        replyMessageAction,
        addReactionAction,
        
        // Moderation actions
        kickUserAction,
        banUserAction,
        deleteMessageAction,
        pinMessageAction,
        
        // Group management actions
        joinGroupAction,
        createGroupAction,
        searchAction,
        
        // Trading/token actions
        sendTokensAction,
        checkBalanceAction,
    ],

    providers: [
        openChatContextProvider,
        openChatCapabilitiesProvider,
    ],

    events: {
        MESSAGE_RECEIVED: [
            async (params: any) => {
                console.log('OpenChat: MESSAGE_RECEIVED event', params);
            },
        ],
    },
};

export default openChatPlugin;
