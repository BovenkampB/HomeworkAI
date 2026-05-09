import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/systemPrompt';
import { UserProfile } from '@/types/profile';

const client = new Anthropic();

export async function POST(req: Request) {
  const { messages, profile, currentSubject } = (await req.json()) as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    profile: UserProfile;
    currentSubject: string;
  };

  const systemPrompt = buildSystemPrompt(profile, currentSubject);

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
              )
            );
          }
        }
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
