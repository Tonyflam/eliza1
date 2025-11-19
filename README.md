# OpenChat Plugin for ElizaOS

A comprehensive plugin that enables ElizaOS agents to fully interact with the OpenChat platform (oc.app).

## 🌟 Features

- **Full Messaging**: Send, receive, reply, edit, delete messages
- **Real-time Updates**: WebSocket integration for instant notifications
- **Group Management**: Create, join, and manage groups/communities
- **Moderation Tools**: Kick, ban, delete messages, pin content
- **Token Operations**: Send and receive ICP, CHAT, and other tokens
- **Search & Discovery**: Find users, groups, and messages

## 🚀 Quick Start

See the [Complete Setup Guide](SETUP_GUIDE.md) for detailed instructions.

```bash
# Install the plugin
npm install @elizaos/plugin-openchat

# Or use the example agent
cd example-agent
npm install
npm run dev
```

## 📦 Repository Contents

- **`packages/plugin-openchat/`** - The OpenChat plugin package
- **`example-agent/`** - Example agent implementation
- **`SETUP_GUIDE.md`** - Complete setup and usage guide

## 🎯 Perfect For

- Moderation agents
- Community managers
- Trading bots
- Support agents
- Custom automation

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Plugin Documentation](packages/plugin-openchat/README.md) - Detailed plugin API
- [Example Agent](example-agent/README.md) - Example implementation

## 🔧 Configuration

```env
OPENCHAT_IDENTITY=your-identity-seed-or-private-key
OPENCHAT_USER_ID=your-principal-id
OPENCHAT_USERNAME=your-username
OPENCHAT_API_URL=https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! See [SETUP_GUIDE.md](SETUP_GUIDE.md) for development instructions.

---

Built with ❤️ for OpenChat and ElizaOS communities