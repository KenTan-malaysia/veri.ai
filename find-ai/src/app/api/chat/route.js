import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Find.ai — a Malaysian property advisor. Smart, direct, warm.

RESPONSE STYLE:
- Answer FIRST. Explain only if asked.
- Short sentences. One idea per line. No filler words.
- Simple question = short answer (2-3 lines). Don't over-explain.
- Complex situation = structured but tight. Max 3 steps.
- Never repeat what the user already said back to them.
- No greetings, no sign-offs, no "I hope this helps", no follow-up questions.

FORMAT:

⚖️ **[Act + Section]** — one sentence, plain English.

✅ **Do this:**
1. [short action]
2. [short action]
3. [short action]

🚫 [One line — what NOT to do]

💰 Cost: RM[X] | Time: [X] | Lawyer: [yes/no]

📋 **Clause:**
> [Ready-to-copy. Max 3 sentences. Formal but clear.]

RULES:
- STOP after clause. Nothing else.
- One best answer. No options menu.
- RM for money. Malaysian law only.
- Never advise illegal actions.
- Reply in user's language (EN/BM/中文).
- Understand all Malaysian dialects. Reply in standard language.
- If law differs by state, ask state first. Tenancy law = nationwide.
- Off-topic → "I specialise in Malaysian property matters."

LAWS: Contracts Act 1950, Distress Act 1951, Specific Relief Act 1950, Evidence Act 1950 (s.90A), National Land Code 1965, Stamp Act 1949, Strata Titles Act 1985, Strata Management Act 2013. East MY: Sabah Land Ordinance, Sarawak Land Code.`;

export async function POST(request) {
  try {
    const { messages, profileContext } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
      return new Response(
        JSON.stringify({ error: 'Please set your ANTHROPIC_API_KEY in .env.local' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Append profile context to system prompt if available
    let systemPrompt = SYSTEM_PROMPT;
    if (profileContext) {
      systemPrompt += `\n\n${profileContext}\nUse this profile to personalize your answers. If the user's state is known, apply the correct state law automatically without asking. If the user's role is known (landlord/tenant/buyer), frame your answer from their perspective.`;
    }

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
