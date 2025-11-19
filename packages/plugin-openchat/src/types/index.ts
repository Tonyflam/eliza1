import { Principal } from '@dfinity/principal';

/**
 * OpenChat user identity information
 */
export interface OpenChatIdentity {
    principal: Principal;
    userId: string;
    username?: string;
}

/**
 * OpenChat message structure
 */
export interface OpenChatMessage {
    messageId: bigint;
    messageIndex: number;
    sender: string;
    content: MessageContent;
    timestamp: bigint;
    edited?: bigint;
    forwarded?: boolean;
    repliesTo?: {
        messageId: bigint;
        messageIndex: number;
    };
    reactions?: Map<string, Set<string>>;
    threadSummary?: ThreadSummary;
}

/**
 * Message content types
 */
export type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'image'; imageUrl: string; caption?: string; width?: number; height?: number }
    | { type: 'video'; videoUrl: string; caption?: string; width?: number; height?: number }
    | { type: 'audio'; audioUrl: string; caption?: string; duration?: number }
    | { type: 'file'; fileUrl: string; fileName: string; fileSize: number; mimeType: string }
    | { type: 'poll'; question: string; options: string[]; votes: Map<number, Set<string>> }
    | { type: 'crypto'; transfer: CryptoTransfer }
    | { type: 'deleted'; deletedBy: string }
    | { type: 'placeholder' };

/**
 * Crypto transfer information
 */
export interface CryptoTransfer {
    token: string;
    amount: bigint;
    recipient: string;
    memo?: string;
}

/**
 * Thread summary
 */
export interface ThreadSummary {
    participantIds: Set<string>;
    latestReplyTimestamp: bigint;
    replyCount: number;
}

/**
 * OpenChat group/community information
 */
export interface OpenChatGroup {
    chatId: string;
    name: string;
    description?: string;
    isPublic: boolean;
    memberCount: number;
    permissions: GroupPermissions;
    avatar?: string;
    latestMessage?: OpenChatMessage;
}

/**
 * Group permissions
 */
export interface GroupPermissions {
    changeRoles: string[];
    addMembers: string[];
    removeMembers: string[];
    deleteMessages: string[];
    pinMessages: string[];
    reactToMessages: string[];
    mentionAllMembers: string[];
    createPolls: string[];
}

/**
 * OpenChat community (super group)
 */
export interface OpenChatCommunity {
    communityId: string;
    name: string;
    description?: string;
    isPublic: boolean;
    memberCount: number;
    channels: OpenChatChannel[];
    permissions: CommunityPermissions;
    avatar?: string;
}

/**
 * OpenChat channel within a community
 */
export interface OpenChatChannel {
    channelId: string;
    name: string;
    description?: string;
    memberCount: number;
    latestMessage?: OpenChatMessage;
}

/**
 * Community permissions
 */
export interface CommunityPermissions {
    changeRoles: string[];
    addMembers: string[];
    removeMembers: string[];
    createChannels: string[];
    deleteChannels: string[];
    updateCommunity: string[];
}

/**
 * OpenChat user profile
 */
export interface OpenChatUser {
    userId: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    suspended?: boolean;
    diamondStatus?: DiamondStatus;
}

/**
 * Diamond status (premium)
 */
export interface DiamondStatus {
    isActive: boolean;
    expiresAt?: bigint;
}

/**
 * Direct chat information
 */
export interface DirectChat {
    chatId: string;
    otherUser: OpenChatUser;
    latestMessage?: OpenChatMessage;
    unreadCount: number;
}

/**
 * Event types for OpenChat
 */
export enum OpenChatEventType {
    MessageSent = 'message_sent',
    MessageReceived = 'message_received',
    MessageEdited = 'message_edited',
    MessageDeleted = 'message_deleted',
    ReactionAdded = 'reaction_added',
    ReactionRemoved = 'reaction_removed',
    UserJoined = 'user_joined',
    UserLeft = 'user_left',
    UserPromoted = 'user_promoted',
    UserDemoted = 'user_demoted',
    GroupCreated = 'group_created',
    GroupUpdated = 'group_updated',
    CommunityCreated = 'community_created',
    CommunityUpdated = 'community_updated',
}

/**
 * WebSocket event structure
 */
export interface OpenChatEvent {
    type: OpenChatEventType;
    chatId?: string;
    communityId?: string;
    channelId?: string;
    message?: OpenChatMessage;
    user?: OpenChatUser;
    timestamp: bigint;
    data?: any;
}

/**
 * Plugin configuration
 */
export interface OpenChatConfig {
    OPENCHAT_IDENTITY?: string;
    OPENCHAT_USER_ID?: string;
    OPENCHAT_USERNAME?: string;
    OPENCHAT_API_URL?: string;
}

/**
 * Message sending options
 */
export interface SendMessageOptions {
    chatId: string;
    content: string | MessageContent;
    replyTo?: bigint;
    forwardFrom?: { chatId: string; messageId: bigint };
    threadRootMessageIndex?: number;
}

/**
 * Search options
 */
export interface SearchOptions {
    query: string;
    chatId?: string;
    maxResults?: number;
    searchUsers?: boolean;
    searchMessages?: boolean;
    searchGroups?: boolean;
}

/**
 * Moderation action types
 */
export enum ModerationAction {
    Kick = 'kick',
    Ban = 'ban',
    Unban = 'unban',
    Promote = 'promote',
    Demote = 'demote',
    DeleteMessage = 'delete_message',
    PinMessage = 'pin_message',
    UnpinMessage = 'unpin_message',
}

/**
 * Trading/swap options
 */
export interface SwapOptions {
    fromToken: string;
    toToken: string;
    amount: bigint;
    slippage?: number;
    recipient?: string;
}

/**
 * Token information
 */
export interface TokenInfo {
    symbol: string;
    name: string;
    canisterId: string;
    decimals: number;
    fee: bigint;
}
