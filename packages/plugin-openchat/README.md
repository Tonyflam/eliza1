# OpenChat Plugin for ElizaOS

A comprehensive plugin that enables ElizaOS agents to interact with the OpenChat platform (oc.app), the decentralized chat application built on the Internet Computer Protocol (ICP).

## Features

### 🎯 Core Capabilities

- **Message Management**: Send, receive, reply, edit, and delete messages
- **Real-time Updates**: WebSocket integration for instant notifications
- **Group & Community Management**: Create, join, and manage groups
- **User Moderation**: Kick, ban, promote/demote users
- **Reactions & Interactions**: Add emoji reactions, pin messages
- **Token Operations**: Send and receive ICP, CHAT, and other tokens
- **Search & Discovery**: Find users, groups, and messages

### 🤖 Perfect For

- **Moderation Agents**: Automatically moderate groups and enforce rules
- **Community Managers**: Welcome new members, answer questions, manage discussions
- **Trading Agents**: Monitor prices, execute trades, send tokens
- **Support Bots**: Provide automated customer support in groups
- **Notification Bots**: Send alerts and updates to communities

## Installation

### Prerequisites

1. Node.js 18+ or Bun
2. ElizaOS CLI installed
3. OpenChat account (create at https://oc.app)

### Step 1: Install Dependencies

```bash
npm install @elizaos/plugin-openchat
# or
bun add @elizaos/plugin-openchat
```

### Step 2: Get OpenChat Credentials

1. Visit https://oc.app and create an account
2. Go to Settings → Advanced → Export Identity
3. Save your identity seed phrase or private key securely
4. Note your User ID (Principal)

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Required
OPENCHAT_IDENTITY=your-seed-phrase-or-private-key
OPENCHAT_USER_ID=your-principal-id

# Optional
OPENCHAT_USERNAME=your-username
OPENCHAT_API_URL=https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app
```

### Step 4: Add Plugin to Your Agent

In your agent's `src/index.ts`:

```typescript
import { openChatPlugin } from '@elizaos/plugin-openchat';

// Add to your agent configuration
const agent = {
    // ... other config
    plugins: [
        openChatPlugin,
        // ... other plugins
    ],
};
```

## Usage Examples

### Sending Messages

```typescript
// In chat or via action
"send to group123: Hello everyone! 👋"
"send to user456: Welcome to our community!"
```

### Replying to Messages

```typescript
"reply to 12345 in group123: Thanks for sharing!"
```

### Adding Reactions

```typescript
"react 👍 to 12345 in group123"
"react ❤️ to 67890 in channel-general"
```

### Moderation Actions

```typescript
// Kick user
"kick spammer123 from group456"

// Ban user
"ban troll456 from community789"

// Delete message
"delete message 12345 from group123"

// Pin message
"pin message 67890 in announcements"
```

### Group Management

```typescript
// Join group
"join group trading-signals"

// Create group
"create group Trading Alerts with description Daily crypto signals (public)"

// Search
"search for crypto trading groups"
```

### Token Operations

```typescript
// Send tokens
"send 10 ICP to alice"
"send 100 CHAT to bob"

// Check balance
"check balance"
"check CHAT balance"
```

## Agent Configuration Examples

### Moderation Agent

```typescript
import { openChatPlugin } from '@elizaos/plugin-openchat';

const moderatorAgent = {
    name: "GroupModerator",
    description: "Automated group moderator",
    plugins: [openChatPlugin],
    
    // Configure moderation rules in your agent's character file
    character: {
        name: "ModBot",
        modelProvider: "openai",
        settings: {
            secrets: {},
            voice: {
                model: "en_US-male-medium"
            }
        },
        bio: [
            "I am an automated moderator that keeps groups safe and friendly.",
            "I can kick spammers, delete inappropriate messages, and welcome new members."
        ],
        lore: [
            "Always enforce community guidelines",
            "Be fair and transparent in moderation",
            "Welcome new members warmly"
        ],
        messageExamples: [
            [
                {
                    user: "{{user1}}",
                    content: { text: "spam spam spam" }
                },
                {
                    user: "ModBot",
                    content: { 
                        text: "delete message 12345 from group123",
                        action: "DELETE_OPENCHAT_MESSAGE"
                    }
                }
            ]
        ]
    }
};
```

### Community Manager Agent

```typescript
const communityManagerAgent = {
    name: "CommunityManager",
    description: "Friendly community manager",
    plugins: [openChatPlugin],
    
    character: {
        name: "CommBot",
        bio: [
            "I welcome new members and help them get started.",
            "I answer common questions and guide discussions."
        ],
        // Add more character configuration
    }
};
```

### Trading Agent

```typescript
const tradingAgent = {
    name: "TradingBot",
    description: "Crypto trading signals bot",
    plugins: [openChatPlugin],
    
    character: {
        name: "TradeBot",
        bio: [
            "I analyze crypto markets and share trading signals.",
            "I can execute trades and manage portfolios."
        ],
        // Add more character configuration
    }
};
```

## API Reference

### Actions

#### Message Actions
- `SEND_OPENCHAT_MESSAGE`: Send a message to a chat
- `REPLY_OPENCHAT_MESSAGE`: Reply to a specific message
- `ADD_OPENCHAT_REACTION`: Add emoji reaction to a message

#### Moderation Actions
- `KICK_OPENCHAT_USER`: Kick user from group (temporary)
- `BAN_OPENCHAT_USER`: Ban user from group (permanent)
- `DELETE_OPENCHAT_MESSAGE`: Delete a message
- `PIN_OPENCHAT_MESSAGE`: Pin important message

#### Group Management Actions
- `JOIN_OPENCHAT_GROUP`: Join a group or community
- `CREATE_OPENCHAT_GROUP`: Create a new group
- `SEARCH_OPENCHAT`: Search for users, groups, or messages

#### Trading Actions
- `SEND_OPENCHAT_TOKENS`: Send tokens to another user
- `CHECK_OPENCHAT_BALANCE`: Check token balance

### Providers

#### `OPENCHAT_CONTEXT`
Provides context about the agent's groups, chats, and activity

#### `OPENCHAT_CAPABILITIES`
Lists available OpenChat capabilities and actions

### Services

#### `OpenChatService`
Main service that manages the connection to OpenChat

Methods:
- `getClient()`: Get the OpenChat client instance
- `isInitialized()`: Check if service is ready

## Architecture

```
plugin-openchat/
├── src/
│   ├── actions/           # Agent actions
│   │   ├── message.ts     # Message operations
│   │   ├── moderation.ts  # Moderation operations
│   │   ├── group.ts       # Group management
│   │   └── trading.ts     # Token operations
│   ├── services/          # Core services
│   │   ├── client.ts      # OpenChat API client
│   │   └── index.ts       # Service implementation
│   ├── providers/         # Context providers
│   │   └── index.ts       # OpenChat providers
│   ├── types/             # TypeScript types
│   │   └── index.ts       # Type definitions
│   ├── plugin.ts          # Plugin definition
│   └── index.ts           # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Building the Plugin

```bash
cd packages/plugin-openchat
npm run build
# or
bun run build
```

### Running Tests

```bash
npm test
# or
bun test
```

### Linting

```bash
npm run lint
# or
bun run lint
```

## Security Considerations

1. **Never commit your identity/credentials** to version control
2. Use environment variables or secure secret management
3. Implement rate limiting for moderation actions
4. Validate user permissions before executing actions
5. Log all moderation actions for accountability
6. Use separate identities for different agents

## Troubleshooting

### Service Not Initialized

If you see "OpenChat service not initialized":
- Check that `OPENCHAT_IDENTITY` and `OPENCHAT_USER_ID` are set
- Verify your credentials are valid
- Check internet connectivity to ic0.app

### WebSocket Connection Issues

- Ensure firewall allows WebSocket connections
- Check if the API URL is correct
- Try reconnecting after a few seconds

### Permission Denied Errors

- Verify your agent has appropriate permissions in the group
- Check if the agent is a moderator/admin for moderation actions
- Ensure the group settings allow the requested action

## Advanced Configuration

### Custom API Endpoints

For testing or custom deployments:

```env
OPENCHAT_API_URL=https://your-custom-openchat-instance.ic0.app
```

### WebSocket Reconnection

The plugin automatically reconnects WebSocket on disconnection with exponential backoff.

### Event Handling

Subscribe to OpenChat events in your agent:

```typescript
// The plugin handles these events automatically
events: {
    MESSAGE_RECEIVED: [/* handlers */],
    USER_JOINED: [/* handlers */],
    // etc.
}
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: https://github.com/Tonyflam/eliza1/issues
- OpenChat Community: https://oc.app
- ElizaOS Documentation: https://elizaos.ai

## Acknowledgments

- OpenChat team for the amazing platform
- ElizaOS team for the agent framework
- Internet Computer community

## Changelog

### Version 1.0.0
- Initial release
- Full message management
- Group and community support
- Moderation capabilities
- Token transfer integration
- Real-time WebSocket updates
- Comprehensive documentation

---

Built with ❤️ for the OpenChat and ElizaOS communities
