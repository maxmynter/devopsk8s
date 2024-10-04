const { connect, StringCodec } = require('nats');
const axios = require('axios');
const sc = StringCodec();

async function sendToDiscord(message) {
	const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
	if (!webhookUrl) {
		console.error('Discord webhook URL not set');
		return;
	}
	try {
		await axios.post(webhookUrl, { content: message });
		console.log('Message sent to Discord');
	} catch (error) {
		console.error('Error sending message to Discord:', error);
	}
}

async function handleSubscription(subscription, subject) {
	console.log(`Subscribed to ${subject}`);
	for await (const msg of subscription) {
		const decoded = sc.decode(msg.data);
		console.log(`Received message from ${subject}:`, decoded);

		await sendToDiscord(`New message from ${subject}: ${decoded}`);
	}
}

async function broadcaster() {
	const nc = await connect({ servers: process.env.NATS_ENDPOINT });
	console.log('Connected to NATS');

	const queueGroup = 'broadcaster-group';
	const subscriptions = [
		{
			subject: 'todo.updated',
			subscription: nc.subscribe('todo.updated', { queue: queueGroup })
		},
		{
			subject: 'todo.created',
			subscription: nc.subscribe('todo.created', { queue: queueGroup })
		}
	];

	subscriptions.forEach(({ subject, subscription }) => {
		handleSubscription(subscription, subject).catch(err =>
			console.error(`Error in ${subject} subscription:`, err)
		);
	});

	process.on('SIGINT', async () => {
		console.log('Shutting down...');
		await nc.drain();
		process.exit(0);
	});
}

broadcaster().catch(err => {
	console.error("Error in broadcaster:", err);
	process.exit(1);
});
