# OpenChat Plugin Quick Reference

## Installation
```bash
npm install @elizaos/plugin-openchat
```

## Configuration
```env
OPENCHAT_IDENTITY=your-identity
OPENCHAT_USER_ID=your-principal-id
OPENCHAT_USERNAME=your-username
```

## Integration
```typescript
import { openChatPlugin } from '@elizaos/plugin-openchat';

const agent = {
    plugins: [openChatPlugin],
    // ... rest of config
};
```

## Actions Cheat Sheet

### Messaging
```typescript
"send to [chatId]: [message]"
"reply to [messageId] in [chatId]: [message]"
"react [emoji] to [messageId] in [chatId]"
```

### Moderation
```typescript
"kick [userId] from [chatId]"
"ban [userId] from [chatId]"
"delete message [messageId] from [chatId]"
"pin message [messageId] in [chatId]"
```

### Group Management
```typescript
"join group [groupId]"
"create group [name] with description [desc] (public|private)"
"search for [query]"
```

### Token Operations
```typescript
"send [amount] [token] to [userId]"
"check balance"
"check [token] balance"
```

## Programmatic Usage
```typescript
const service = runtime.getService('openchat');
const client = service.getClient();

// Send message
await client.sendMessage({
    chatId: 'group123',
    content: 'Hello!'
});

// Moderate
await client.kickUser('group123', 'spammer');
await client.deleteMessage('group123', messageId);

// Tokens
await client.sendTokens('alice', 'ICP', BigInt(1000000000));
const balance = await client.getTokenBalance('ICP');
```

## Event Handling
```typescript
client.on(OpenChatEventType.MessageReceived, (event) => {
    console.log('New message:', event.message);
});

client.on(OpenChatEventType.UserJoined, (event) => {
    console.log('User joined:', event.user);
});
```

## Common Patterns

### Auto-Moderation
```typescript
client.on(OpenChatEventType.MessageReceived, async (event) => {
    if (containsSpam(event.message.content)) {
        await client.deleteMessage(event.chatId, event.message.messageId);
        await client.kickUser(event.chatId, event.message.sender);
    }
});
```

### Welcome Bot
```typescript
client.on(OpenChatEventType.UserJoined, async (event) => {
    await client.sendMessage({
        chatId: event.chatId,
        content: `Welcome ${event.user.username}! 👋`
    });
});
```

### Trading Signals
```typescript
async function sendTradingSignal(groupId: string, signal: string) {
    await client.sendMessage({
        chatId: groupId,
        content: `🚨 Trading Signal: ${signal}`
    });
}
```

## Debugging
```typescript
// Check if service is initialized
if (!service.isInitialized()) {
    console.error('Service not initialized');
}

// Get client info
const userId = client.getUserId();
console.log('Agent user ID:', userId);
```

## Error Handling
```typescript
try {
    await client.sendMessage({...});
} catch (error) {
    console.error('Failed to send message:', error);
    // Handle error appropriately
}
```

## Best Practices

1. **Always validate** before moderation actions
2. **Log all actions** for accountability
3. **Rate limit** to avoid spam
4. **Handle errors** gracefully
5. **Test thoroughly** in dev environment
6. **Monitor** for unusual activity
7. **Rotate credentials** regularly
8. **Use separate identities** for different agents

## Resources

- [Setup Guide](SETUP_GUIDE.md)
- [Full Documentation](packages/plugin-openchat/README.md)
- [Example Agent](example-agent/)
- [OpenChat Docs](https://oc.app)

## Support

- Issues: https://github.com/Tonyflam/eliza1/issues
- OpenChat: https://oc.app
- ElizaOS: https://elizaos.ai
