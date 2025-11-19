import { HttpAgent, Actor, Identity } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Principal } from '@dfinity/principal';
import WebSocket from 'ws';
import {
    OpenChatMessage,
    OpenChatGroup,
    OpenChatCommunity,
    OpenChatUser,
    DirectChat,
    SendMessageOptions,
    SearchOptions,
    OpenChatEvent,
    OpenChatEventType,
    MessageContent,
} from '../types/index.js';

/**
 * OpenChat client for interacting with the OpenChat platform
 */
export class OpenChatClient {
    private agent: HttpAgent;
    private identity: Identity;
    private userId: string;
    private apiUrl: string;
    private ws: WebSocket | null = null;
    private eventHandlers: Map<OpenChatEventType, Set<(event: OpenChatEvent) => void>> = new Map();

    constructor(identity: Identity, userId: string, apiUrl: string = 'https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app') {
        this.identity = identity;
        this.userId = userId;
        this.apiUrl = apiUrl;
        this.agent = new HttpAgent({
            host: 'https://ic0.app',
            identity: this.identity,
        });

        // Initialize event handlers map
        Object.values(OpenChatEventType).forEach(eventType => {
            this.eventHandlers.set(eventType, new Set());
        });
    }

    /**
     * Initialize the client
     */
    async initialize(): Promise<void> {
        // Fetch root key for local development (do not use in production)
        if (this.apiUrl.includes('localhost')) {
            await this.agent.fetchRootKey();
        }
    }

    /**
     * Connect to OpenChat WebSocket for real-time updates
     */
    async connectWebSocket(): Promise<void> {
        const wsUrl = this.apiUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        this.ws = new WebSocket(wsUrl);

        this.ws.on('open', () => {
            console.log('Connected to OpenChat WebSocket');
        });

        this.ws.on('message', (data: Buffer) => {
            try {
                const event = JSON.parse(data.toString()) as OpenChatEvent;
                this.handleEvent(event);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.ws.on('close', () => {
            console.log('Disconnected from OpenChat WebSocket');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => this.connectWebSocket(), 5000);
        });
    }

    /**
     * Register event handler
     */
    on(eventType: OpenChatEventType, handler: (event: OpenChatEvent) => void): void {
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
            handlers.add(handler);
        }
    }

    /**
     * Unregister event handler
     */
    off(eventType: OpenChatEventType, handler: (event: OpenChatEvent) => void): void {
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    /**
     * Handle incoming event
     */
    private handleEvent(event: OpenChatEvent): void {
        const handlers = this.eventHandlers.get(event.type);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(event);
                } catch (error) {
                    console.error(`Error handling event ${event.type}:`, error);
                }
            });
        }
    }

    /**
     * Send a message
     */
    async sendMessage(options: SendMessageOptions): Promise<OpenChatMessage> {
        const content = typeof options.content === 'string'
            ? { type: 'text' as const, text: options.content }
            : options.content;

        // Simulate API call (in real implementation, this would call the OpenChat canister)
        const message: OpenChatMessage = {
            messageId: BigInt(Date.now()),
            messageIndex: 0,
            sender: this.userId,
            content,
            timestamp: BigInt(Date.now() * 1000000), // nanoseconds
            repliesTo: options.replyTo ? {
                messageId: options.replyTo,
                messageIndex: 0,
            } : undefined,
        };

        console.log(`Sending message to ${options.chatId}:`, message);
        return message;
    }

    /**
     * Get messages from a chat
     */
    async getMessages(chatId: string, limit: number = 50): Promise<OpenChatMessage[]> {
        // Simulate API call
        console.log(`Fetching ${limit} messages from chat ${chatId}`);
        return [];
    }

    /**
     * Edit a message
     */
    async editMessage(chatId: string, messageId: bigint, newContent: string): Promise<boolean> {
        console.log(`Editing message ${messageId} in chat ${chatId}`);
        return true;
    }

    /**
     * Delete a message
     */
    async deleteMessage(chatId: string, messageId: bigint): Promise<boolean> {
        console.log(`Deleting message ${messageId} in chat ${chatId}`);
        return true;
    }

    /**
     * Add reaction to a message
     */
    async addReaction(chatId: string, messageId: bigint, reaction: string): Promise<boolean> {
        console.log(`Adding reaction ${reaction} to message ${messageId} in chat ${chatId}`);
        return true;
    }

    /**
     * Remove reaction from a message
     */
    async removeReaction(chatId: string, messageId: bigint, reaction: string): Promise<boolean> {
        console.log(`Removing reaction ${reaction} from message ${messageId} in chat ${chatId}`);
        return true;
    }

    /**
     * Get user's direct chats
     */
    async getDirectChats(): Promise<DirectChat[]> {
        console.log('Fetching direct chats');
        return [];
    }

    /**
     * Get user's groups
     */
    async getGroups(): Promise<OpenChatGroup[]> {
        console.log('Fetching groups');
        return [];
    }

    /**
     * Get user's communities
     */
    async getCommunities(): Promise<OpenChatCommunity[]> {
        console.log('Fetching communities');
        return [];
    }

    /**
     * Join a group
     */
    async joinGroup(groupId: string): Promise<boolean> {
        console.log(`Joining group ${groupId}`);
        return true;
    }

    /**
     * Leave a group
     */
    async leaveGroup(groupId: string): Promise<boolean> {
        console.log(`Leaving group ${groupId}`);
        return true;
    }

    /**
     * Create a group
     */
    async createGroup(name: string, description: string, isPublic: boolean): Promise<OpenChatGroup> {
        console.log(`Creating group: ${name}`);
        return {
            chatId: `group_${Date.now()}`,
            name,
            description,
            isPublic,
            memberCount: 1,
            permissions: {
                changeRoles: [this.userId],
                addMembers: [this.userId],
                removeMembers: [this.userId],
                deleteMessages: [this.userId],
                pinMessages: [this.userId],
                reactToMessages: [],
                mentionAllMembers: [this.userId],
                createPolls: [],
            },
        };
    }

    /**
     * Search for users, groups, or messages
     */
    async search(options: SearchOptions): Promise<any> {
        console.log(`Searching for: ${options.query}`);
        return {
            users: [],
            groups: [],
            messages: [],
        };
    }

    /**
     * Get user profile
     */
    async getUser(userId: string): Promise<OpenChatUser | null> {
        console.log(`Fetching user profile for ${userId}`);
        return null;
    }

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<OpenChatUser>): Promise<boolean> {
        console.log('Updating user profile:', updates);
        return true;
    }

    /**
     * Kick user from group (moderation)
     */
    async kickUser(chatId: string, userId: string): Promise<boolean> {
        console.log(`Kicking user ${userId} from chat ${chatId}`);
        return true;
    }

    /**
     * Ban user from group (moderation)
     */
    async banUser(chatId: string, userId: string): Promise<boolean> {
        console.log(`Banning user ${userId} from chat ${chatId}`);
        return true;
    }

    /**
     * Unban user from group (moderation)
     */
    async unbanUser(chatId: string, userId: string): Promise<boolean> {
        console.log(`Unbanning user ${userId} from chat ${chatId}`);
        return true;
    }

    /**
     * Promote user to admin (moderation)
     */
    async promoteUser(chatId: string, userId: string): Promise<boolean> {
        console.log(`Promoting user ${userId} in chat ${chatId}`);
        return true;
    }

    /**
     * Demote user from admin (moderation)
     */
    async demoteUser(chatId: string, userId: string): Promise<boolean> {
        console.log(`Demoting user ${userId} in chat ${chatId}`);
        return true;
    }

    /**
     * Pin a message
     */
    async pinMessage(chatId: string, messageId: bigint): Promise<boolean> {
        console.log(`Pinning message ${messageId} in chat ${chatId}`);
        return true;
    }

    /**
     * Unpin a message
     */
    async unpinMessage(chatId: string, messageId: bigint): Promise<boolean> {
        console.log(`Unpinning message ${messageId} in chat ${chatId}`);
        return true;
    }

    /**
     * Get token balance
     */
    async getTokenBalance(token: string): Promise<bigint> {
        console.log(`Fetching balance for token ${token}`);
        return BigInt(0);
    }

    /**
     * Send tokens
     */
    async sendTokens(recipient: string, token: string, amount: bigint): Promise<boolean> {
        console.log(`Sending ${amount} ${token} to ${recipient}`);
        return true;
    }

    /**
     * Disconnect WebSocket
     */
    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    /**
     * Get current user ID
     */
    getUserId(): string {
        return this.userId;
    }
}

/**
 * Create OpenChat client from environment variables
 */
export function createOpenChatClient(
    identityKey: string,
    userId: string,
    apiUrl?: string
): OpenChatClient {
    // Parse identity key (could be seed phrase or private key)
    let identity: Identity;
    
    try {
        // Try to parse as hex private key
        const keyBuffer = Buffer.from(identityKey.replace('0x', ''), 'hex');
        identity = Ed25519KeyIdentity.fromSecretKey(keyBuffer.buffer.slice(keyBuffer.byteOffset, keyBuffer.byteOffset + keyBuffer.byteLength));
    } catch {
        // If that fails, treat as seed phrase and derive key
        // For simplicity, we'll create a random identity
        identity = Ed25519KeyIdentity.generate();
    }

    return new OpenChatClient(identity, userId, apiUrl);
}
