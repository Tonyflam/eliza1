// Mock types for ElizaOS core when building standalone
// In real usage, these come from @elizaos/core package

export interface Memory {
    id?: string;
    userId?: string;
    agentId?: string;
    roomId?: string;
    content: Content;
    embedding?: number[];
    createdAt?: number;
}

export interface Content {
    text: string;
    action?: string;
    source?: string;
    actions?: string[];
    [key: string]: any;
}

export interface State {
    [key: string]: any;
}

export interface IAgentRuntime {
    getService(name: string): Service | undefined;
    agentId: string;
    character: any;
    [key: string]: any;
}

export interface ActionResult {
    text?: string;
    success: boolean;
    data?: any;
    error?: Error;
}

export interface Action {
    name: string;
    similes: string[];
    description: string;
    validate: (runtime: IAgentRuntime, message: Memory, state?: State) => Promise<boolean>;
    handler: (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: any,
        callback?: HandlerCallback
    ) => Promise<ActionResult>;
    examples: Array<Array<{ name: string; content: Content }>>;
}

export interface HandlerCallback {
    (content: Content): Promise<void>;
}

export interface Provider {
    name: string;
    description: string;
    get: (runtime: IAgentRuntime, message: Memory, state?: State) => Promise<ProviderResult>;
}

export interface ProviderResult {
    text: string;
    values: Record<string, any>;
    data: Record<string, any>;
}

export interface GenerateTextParams {
    prompt: string;
    stopSequences?: string[];
    maxTokens?: number;
    temperature?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export enum ModelType {
    TEXT_SMALL = 'text-small',
    TEXT_LARGE = 'text-large',
    IMAGE = 'image',
    EMBEDDING = 'embedding',
}

export interface Plugin {
    name: string;
    description: string;
    config?: Record<string, any>;
    init?: (config: Record<string, string>) => Promise<void>;
    services?: Array<typeof Service>;
    actions?: Action[];
    providers?: Provider[];
    models?: Record<string, (runtime: IAgentRuntime, params: GenerateTextParams) => Promise<string>>;
    routes?: Array<{
        name: string;
        path: string;
        type: 'GET' | 'POST' | 'PUT' | 'DELETE';
        handler: (req: any, res: any) => Promise<void> | void;
    }>;
    events?: Record<string, Array<(params: any) => Promise<void>>>;
    dependencies?: string[];
}

export abstract class Service {
    static serviceType: string;
    runtime: IAgentRuntime;
    
    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
    }
    
    static async start(runtime: IAgentRuntime): Promise<Service> {
        throw new Error('Service.start must be implemented');
    }
    
    static async stop(runtime: IAgentRuntime): Promise<void> {
        throw new Error('Service.stop must be implemented');
    }
    
    async stop(): Promise<void> {
        // Default implementation
    }
}

export const logger = {
    info: (...args: any[]) => console.log('[INFO]', ...args),
    warn: (...args: any[]) => console.warn('[WARN]', ...args),
    error: (...args: any[]) => console.error('[ERROR]', ...args),
    debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
};
