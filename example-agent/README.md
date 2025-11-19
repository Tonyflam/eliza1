# OpenChat Agent Example

This is an example agent that uses the OpenChat plugin for ElizaOS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your OpenChat credentials:
```env
OPENCHAT_IDENTITY=your-identity-seed-or-private-key
OPENCHAT_USER_ID=your-principal-id
OPENCHAT_USERNAME=your-username
OPENCHAT_API_URL=https://5v72r-4qaaa-aaaaf-aaapq-cai.ic0.app
```

3. Build the agent:
```bash
npm run build
```

4. Run the agent:
```bash
npm start
```

## Agent Types

This example can be adapted for different use cases:

### Moderation Agent
- Automatically kick/ban rule violators
- Delete inappropriate messages
- Welcome new members
- Monitor chat activity

### Community Manager
- Answer common questions
- Guide discussions
- Share updates and announcements
- Engage with community members

### Trading Agent
- Share trading signals
- Execute token transfers
- Monitor market conditions
- Provide price alerts

### Support Bot
- Answer FAQs
- Provide platform guidance
- Help with troubleshooting
- Route complex issues to humans

## Available Actions

The agent has access to all OpenChat plugin actions:

- `SEND_OPENCHAT_MESSAGE` - Send messages
- `REPLY_OPENCHAT_MESSAGE` - Reply to messages
- `ADD_OPENCHAT_REACTION` - Add reactions
- `KICK_OPENCHAT_USER` - Kick users (moderation)
- `BAN_OPENCHAT_USER` - Ban users (moderation)
- `DELETE_OPENCHAT_MESSAGE` - Delete messages (moderation)
- `PIN_OPENCHAT_MESSAGE` - Pin messages
- `JOIN_OPENCHAT_GROUP` - Join groups
- `CREATE_OPENCHAT_GROUP` - Create groups
- `SEARCH_OPENCHAT` - Search for users/groups
- `SEND_OPENCHAT_TOKENS` - Send tokens
- `CHECK_OPENCHAT_BALANCE` - Check balances

## Customization

Edit `src/index.ts` to customize:
- Agent personality and behavior
- Message examples
- Response style
- Topics of expertise
- Moderation rules

## Integration

To integrate with a full ElizaOS setup:

1. Install the plugin in your ElizaOS project:
```bash
npm install @elizaos/plugin-openchat
```

2. Add to your agent configuration:
```typescript
import { openChatPlugin } from '@elizaos/plugin-openchat';

const agent = {
    // ... your config
    plugins: [
        openChatPlugin,
        // ... other plugins
    ],
};
```

3. Configure environment variables and run your agent.

## Learn More

- [OpenChat Platform](https://oc.app)
- [ElizaOS Documentation](https://elizaos.ai)
- [Plugin README](../packages/plugin-openchat/README.md)
