import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const openrouter = createOpenAICompatible({
	name: 'openrouter',
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1',
})
export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json()

	try {
		const result = streamText({
			model: openrouter('deepseek/deepseek-chat-v3-0324'),
			messages: await convertToModelMessages(messages),
		})

		return result.toUIMessageStreamResponse()
	} catch (e) {
		console.error(e)
		return new Response(JSON.stringify(e), { status: 500 })
	}
}
