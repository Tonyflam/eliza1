# OpenChat Plugin for ElizaOS - Complete Setup Guide

This repository contains a complete OpenChat integration plugin for ElizaOS, enabling agents to interact fully with the OpenChat platform (oc.app).

## 📦 Repository Structure

```
eliza1/
├── packages/
│   └── plugin-openchat/          # OpenChat plugin package
│       ├── src/
│       │   ├── actions/          # Agent actions (send, moderate, trade, etc.)
│       │   ├── services/         # OpenChat client and service
│       │   ├── providers/        # Context providers
│       │   ├── types/            # TypeScript types
│       │   └── plugin.ts         # Plugin definition
│       ├── package.json
│       └── README.md             # Detailed plugin documentation
├── example-agent/                # Example agent implementation
│   ├── src/
│   │   └── index.ts             # Example agent code
│   └── README.md
└── SETUP_GUIDE.md               # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ or Bun
- An OpenChat account at https://oc.app
- Basic knowledge of ElizaOS (optional but helpful)

### 2. Get Your OpenChat Credentials

1. Go to https://oc.app
2. Create or log into your account
3. Navigate to **Settings → Advanced → Export Identity**
4. Save your identity seed phrase or private key (keep it secure!)
5. Note your User ID (Principal) from your profile

### 3. Install the Plugin

#### Option A: Use in an Existing ElizaOS Project

```bash
npm install @elizaos/plugin-openchat
```

Add to your agent configuration:

```typescript
import { openChatPlugin } from '@elizaos/plugin-openchat';

const agent = {
    plugins: [
        openChatPlugin,
        // ... other plugins
    ],
};
```

#### Option B: Use the Example Agent

```bash
cd example-agent
npm install
```

### 4. Configure Environment Variables

Create a `.env` file:

```env
OPENCHAT_IDENTITY=your-seed-phrase-or-private-key
OPENCHAT_USER_ID=your-principal-id
OPENCHAT_USERNAME=your-username
OPENCHAT_API_URL=https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app
```

### 5. Build and Run

```bash
# Build the plugin
cd packages/plugin-openchat
npm install
npm run build

# Run the example agent
cd ../../example-agent
npm install
npm run dev
```

## 🎯 Use Cases

### 1. Moderation Agent

Create an agent that automatically moderates your OpenChat groups:

```typescript
const moderatorAgent = {
    name: "GroupModerator",
    plugins: [openChatPlugin],
    character: {
        bio: ["I moderate groups and enforce community guidelines."],
        // Configure moderation rules
    }
};
```

**Capabilities:**
- Auto-kick spammers
- Delete inappropriate messages
- Ban repeat offenders
- Welcome new members
- Monitor chat activity

### 2. Community Manager Agent

An agent that engages with your community:

```typescript
const communityAgent = {
    name: "CommunityManager",
    plugins: [openChatPlugin],
    character: {
        bio: ["I help manage and grow communities."],
        // Configure engagement rules
    }
};
```

**Capabilities:**
- Answer common questions
- Share announcements
- Organize events
- Guide discussions
- Onboard new members

### 3. Trading Agent

A bot that provides trading signals and executes trades:

```typescript
const tradingAgent = {
    name: "TradingBot",
    plugins: [openChatPlugin],
    character: {
        bio: ["I provide crypto trading signals and manage portfolios."],
        // Configure trading rules
    }
};
```

**Capabilities:**
- Share trading signals
- Execute token transfers
- Monitor market conditions
- Provide price alerts
- Manage portfolios

### 4. Support Bot

An agent that provides customer support:

```typescript
const supportAgent = {
    name: "SupportBot",
    plugins: [openChatPlugin],
    character: {
        bio: ["I provide customer support and answer questions."],
        // Configure support knowledge
    }
};
```

**Capabilities:**
- Answer FAQs
- Provide platform guidance
- Troubleshoot issues
- Route complex queries
- Collect feedback

## 📚 Plugin Features

### Core Actions

#### Messaging
- `SEND_OPENCHAT_MESSAGE` - Send messages to users/groups
- `REPLY_OPENCHAT_MESSAGE` - Reply to specific messages
- `ADD_OPENCHAT_REACTION` - Add emoji reactions

#### Moderation
- `KICK_OPENCHAT_USER` - Temporarily remove users
- `BAN_OPENCHAT_USER` - Permanently ban users
- `DELETE_OPENCHAT_MESSAGE` - Remove messages
- `PIN_OPENCHAT_MESSAGE` - Pin important messages

#### Group Management
- `JOIN_OPENCHAT_GROUP` - Join groups/communities
- `CREATE_OPENCHAT_GROUP` - Create new groups
- `SEARCH_OPENCHAT` - Search users/groups/messages

#### Token Operations
- `SEND_OPENCHAT_TOKENS` - Send ICP, CHAT, etc.
- `CHECK_OPENCHAT_BALANCE` - Check token balances

### Real-time Features

The plugin includes WebSocket support for:
- Instant message notifications
- Real-time user events
- Live group updates
- Immediate reaction notifications

## 🔧 Configuration

### Basic Configuration

```typescript
await openChatPlugin.init({
    OPENCHAT_IDENTITY: 'your-identity',
    OPENCHAT_USER_ID: 'your-principal',
    OPENCHAT_USERNAME: 'your-username',
    OPENCHAT_API_URL: 'https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app',
});
```

### Advanced Configuration

For custom deployments or testing:

```typescript
await openChatPlugin.init({
    OPENCHAT_IDENTITY: process.env.OPENCHAT_IDENTITY,
    OPENCHAT_USER_ID: process.env.OPENCHAT_USER_ID,
    OPENCHAT_API_URL: 'https://your-custom-instance.ic0.app',
});
```

## 📖 Usage Examples

### Sending a Message

```typescript
// Via natural language (with ElizaOS)
"send to group123: Hello everyone! 👋"

// Or programmatically
const client = openChatService.getClient();
await client.sendMessage({
    chatId: 'group123',
    content: 'Hello everyone! 👋'
});
```

### Moderating Content

```typescript
// Kick a user
"kick spammer123 from group456"

// Ban a user
"ban troll456 from community789"

// Delete a message
"delete message 12345 from group123"
```

### Managing Groups

```typescript
// Join a group
"join group trading-signals"

// Create a group
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

## 🔐 Security Best Practices

1. **Never commit credentials** to version control
2. Use environment variables or secure secret management
3. Implement rate limiting for actions
4. Validate permissions before executing
5. Log all moderation actions
6. Use separate identities for different agents
7. Regularly rotate credentials
8. Monitor for unusual activity

## 🐛 Troubleshooting

### Service Not Initialized

**Problem:** "OpenChat service not initialized" error

**Solutions:**
- Verify `OPENCHAT_IDENTITY` and `OPENCHAT_USER_ID` are set
- Check credentials are valid
- Ensure internet connectivity to ic0.app

### WebSocket Connection Issues

**Problem:** WebSocket keeps disconnecting

**Solutions:**
- Check firewall settings
- Verify API URL is correct
- Wait for automatic reconnection (5-second backoff)

### Permission Denied

**Problem:** "Permission denied" for moderation actions

**Solutions:**
- Verify agent has moderator/admin role
- Check group settings allow the action
- Ensure correct group ID is used

### Token Transfer Failures

**Problem:** Token transfers not working

**Solutions:**
- Check sufficient balance
- Verify token symbol is correct
- Ensure recipient ID is valid
- Check network status

## 🧪 Testing

### Test the Plugin Build

```bash
cd packages/plugin-openchat
npm run build
```

### Test the Example Agent

```bash
cd example-agent
npm run dev
```

### Manual Testing

1. Set up test environment variables
2. Run the example agent
3. Test each action type:
   - Send a message to a test group
   - Add a reaction
   - Check balance
   - Search for groups

## 📝 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Tonyflam/eliza1.git
cd eliza1

# Install dependencies
cd packages/plugin-openchat
npm install

# Build
npm run build
```

### Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Documentation

- [Plugin README](packages/plugin-openchat/README.md) - Detailed plugin documentation
- [Example Agent README](example-agent/README.md) - Example implementation
- [OpenChat Documentation](https://oc.app/docs) - OpenChat platform docs
- [ElizaOS Documentation](https://elizaos.ai/docs) - ElizaOS framework docs

## 🆘 Support

- **GitHub Issues:** https://github.com/Tonyflam/eliza1/issues
- **OpenChat Community:** Join groups on oc.app
- **ElizaOS Discord:** Join the ElizaOS community

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenChat team for building an amazing decentralized chat platform
- ElizaOS team for creating a powerful agent framework
- Internet Computer community for the underlying infrastructure

## 🎉 Next Steps

1. ✅ Install and configure the plugin
2. ✅ Run the example agent
3. ✅ Create your first custom agent
4. ✅ Join OpenChat communities
5. ✅ Deploy your agent to production

Ready to build amazing OpenChat agents? Get started now! 🚀

---

Built with ❤️ for the OpenChat and ElizaOS communities
