import { Service } from '../core-types.js';
import type { IAgentRuntime } from '../core-types.js';
import { OpenChatClient, createOpenChatClient } from './client.js';
import { OpenChatEvent, OpenChatEventType } from '../types/index.js';

/**
 * OpenChat service for ElizaOS
 */
export class OpenChatService extends Service {
    static serviceType = 'openchat';
    
    private client: OpenChatClient | null = null;
    
    capabilityDescription =
        'This service enables the agent to interact with OpenChat (oc.app) platform, ' +
        'including sending messages, managing groups, moderating content, and more.';

    constructor(runtime: IAgentRuntime) {
        super(runtime);
        this.runtime = runtime;
    }

    /**
     * Start the OpenChat service
     */
    static async start(runtime: IAgentRuntime): Promise<OpenChatService> {
        console.log('Starting OpenChat service');
        
        const service = new OpenChatService(runtime);
        
        // Get configuration from environment
        const identityKey = process.env.OPENCHAT_IDENTITY;
        const userId = process.env.OPENCHAT_USER_ID;
        const apiUrl = process.env.OPENCHAT_API_URL || 'https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app';

        if (!identityKey || !userId) {
            console.warn('OpenChat credentials not configured. Service will run in limited mode.');
            return service;
        }

        try {
            // Create and initialize client
            service.client = createOpenChatClient(identityKey, userId, apiUrl);
            await service.client.initialize();
            
            // Connect to WebSocket for real-time updates
            await service.client.connectWebSocket();
            
            // Set up event handlers
            service.setupEventHandlers();
            
            console.log('OpenChat service started successfully');
        } catch (error) {
            console.error('Error starting OpenChat service:', error);
            throw error;
        }

        return service;
    }

    /**
     * Stop the OpenChat service
     */
    static async stop(runtime: IAgentRuntime): Promise<void> {
        console.log('Stopping OpenChat service');
        
        const service = runtime.getService(OpenChatService.serviceType) as OpenChatService;
        if (!service) {
            console.warn('OpenChat service not found');
            return;
        }

        await service.stop();
    }

    /**
     * Stop the service
     */
    async stop(): Promise<void> {
        if (this.client) {
            this.client.disconnect();
            this.client = null;
        }
        console.log('OpenChat service stopped');
    }

    /**
     * Set up event handlers for OpenChat events
     */
    private setupEventHandlers(): void {
        if (!this.client) return;

        // Handle incoming messages
        this.client.on(OpenChatEventType.MessageReceived, async (event: OpenChatEvent) => {
            try {
                if (event.message) {
                    console.log('Received message:', event.message);
                    // Process message through ElizaOS
                    await this.handleIncomingMessage(event);
                }
            } catch (error) {
                console.error('Error handling message received event:', error);
            }
        });

        // Handle reactions
        this.client.on(OpenChatEventType.ReactionAdded, async (event: OpenChatEvent) => {
            console.log('Reaction added:', event);
        });

        // Handle user joins
        this.client.on(OpenChatEventType.UserJoined, async (event: OpenChatEvent) => {
            console.log('User joined:', event);
        });

        // Handle user leaves
        this.client.on(OpenChatEventType.UserLeft, async (event: OpenChatEvent) => {
            console.log('User left:', event);
        });
    }

    /**
     * Handle incoming message
     */
    private async handleIncomingMessage(event: OpenChatEvent): Promise<void> {
        // This would integrate with ElizaOS message processing
        // The agent would decide whether and how to respond
        console.log('Processing incoming message through ElizaOS');
    }

    /**
     * Get the OpenChat client
     */
    getClient(): OpenChatClient | null {
        return this.client;
    }

    /**
     * Check if service is initialized
     */
    isInitialized(): boolean {
        return this.client !== null;
    }
}
