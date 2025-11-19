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
 * Action to send tokens/crypto
 */
export const sendTokensAction: Action = {
    name: 'SEND_OPENCHAT_TOKENS',
    similes: ['OPENCHAT_SEND_CRYPTO', 'SEND_OC_TOKENS', 'TRANSFER_TOKENS'],
    description: 'Send tokens or cryptocurrency to another user on OpenChat',

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

            // Parse: "send [amount] [token] to [userId]"
            const match = text.match(/send ([0-9.]+)\s+([A-Z]+)\s+to\s+(.+)/i);
            
            if (!match) {
                throw new Error('Invalid format. Use: send [amount] [token] to [userId]');
            }

            const amount = match[1];
            const token = match[2].toUpperCase();
            const recipient = match[3].trim();

            // Convert amount to smallest unit (considering decimals)
            const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 100000000)); // 8 decimals

            // Send tokens
            await client.sendTokens(recipient, token, amountBigInt);

            const response = `Successfully sent ${amount} ${token} to ${recipient}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['SEND_OPENCHAT_TOKENS'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    amount,
                    token,
                    recipient,
                    actions: ['SEND_OPENCHAT_TOKENS'],
                },
            };
        } catch (error) {
            console.error('Error sending tokens:', error);
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
                    text: 'send 10 ICP to user123',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Successfully sent 10 ICP to user123',
                    actions: ['SEND_OPENCHAT_TOKENS'],
                },
            },
        ],
        [
            {
                name: '{{userName}}',
                content: {
                    text: 'send 100 CHAT to alice',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Successfully sent 100 CHAT to alice',
                    actions: ['SEND_OPENCHAT_TOKENS'],
                },
            },
        ],
    ],
};

/**
 * Action to check token balance
 */
export const checkBalanceAction: Action = {
    name: 'CHECK_OPENCHAT_BALANCE',
    similes: ['OPENCHAT_BALANCE', 'CHECK_OC_TOKENS', 'GET_BALANCE'],
    description: 'Check token balance on OpenChat',

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

            // Parse: "check balance" or "check [token] balance"
            const match = text.match(/check (?:([A-Z]+) )?balance/i);
            
            const token = match?.[1]?.toUpperCase() || 'ICP';

            // Get balance
            const balance = await client.getTokenBalance(token);

            // Convert from smallest unit to human readable (8 decimals)
            const balanceNumber = Number(balance) / 100000000;

            const response = `Your ${token} balance: ${balanceNumber.toFixed(8)} ${token}`;

            if (callback) {
                await callback({
                    text: response,
                    actions: ['CHECK_OPENCHAT_BALANCE'],
                    source: content.source,
                });
            }

            return {
                text: response,
                success: true,
                data: {
                    token,
                    balance: balance.toString(),
                    balanceFormatted: balanceNumber.toFixed(8),
                    actions: ['CHECK_OPENCHAT_BALANCE'],
                },
            };
        } catch (error) {
            console.error('Error checking balance:', error);
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
                    text: 'check balance',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Your ICP balance: 25.50000000 ICP',
                    actions: ['CHECK_OPENCHAT_BALANCE'],
                },
            },
        ],
        [
            {
                name: '{{userName}}',
                content: {
                    text: 'check CHAT balance',
                    actions: [],
                },
            },
            {
                name: '{{agentName}}',
                content: {
                    text: 'Your CHAT balance: 1000.00000000 CHAT',
                    actions: ['CHECK_OPENCHAT_BALANCE'],
                },
            },
        ],
    ],
};
