import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { YOUTUBE_STRATEGIST_PROMPT } from '@/lib/prompts/youtube-strategist';
import { THUMBNAIL_STRATEGIST_PROMPT } from '@/lib/prompts/thumbnail-strategist';
import { SOCIAL_VIRAL_PROMPT } from '@/lib/prompts/social-viral';
import { PODCAST_PLATFORMS_PROMPT } from '@/lib/prompts/podcast-platforms';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PLATFORM_PROMPTS: Record<string, string> = {
  youtube:   YOUTUBE_STRATEGIST_PROMPT,
  thumbnail: THUMBNAIL_STRATEGIST_PROMPT,
  social:    SOCIAL_VIRAL_PROMPT,
  podcast:   PODCAST_PLATFORMS_PROMPT,
};

function buildUserMessage(params: {
  platform: string;
  episodeNumber: string;
  episodeTopic: string;
  episodeTranscript: string;
  shortClips?: { label: string; transcript: string }[];
}): string {
  const { platform, episodeNumber, episodeTopic, episodeTranscript, shortClips } = params;

  const header = [
    episodeNumber ? `Episode Number: ${episodeNumber}` : null,
    episodeTopic  ? `Episode Topic: ${episodeTopic}`   : null,
  ].filter(Boolean).join('\n');

  if (platform === 'social') {
    const clipsText = (shortClips ?? [])
      .map((c, i) => `--- CLIP ${i + 1}: ${c.label} ---\n${c.transcript}`)
      .join('\n\n');
    return `${header}\n\nFULL EPISODE TRANSCRIPT (for context):\n${episodeTranscript}\n\nSHORT CLIPS TO PROCESS:\n${clipsText}`;
  }

  return `${header}\n\nFULL EPISODE TRANSCRIPT:\n${episodeTranscript}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, episodeNumber, episodeTopic, episodeTranscript, shortClips } = body;

    if (!platform || !episodeTranscript) {
      return NextResponse.json({ error: 'Missing platform or transcript' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set. Add it to your .env.local file.' },
        { status: 500 }
      );
    }

    const systemPrompt = PLATFORM_PROMPTS[platform];
    if (!systemPrompt) {
      return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 });
    }

    const userMessage = buildUserMessage({
      platform,
      episodeNumber: episodeNumber ?? '',
      episodeTopic:  episodeTopic  ?? '',
      episodeTranscript,
      shortClips,
    });

    console.log(`[generate] calling Claude for platform: ${platform}`);

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 4096,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userMessage }],
    });

    console.log(`[generate] Claude responded, stop_reason: ${message.stop_reason}`);

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error(`[generate] JSON parse failed. Raw response:\n${rawText.slice(0, 500)}`);
      return NextResponse.json(
        { error: 'Claude returned invalid JSON. Try again.', raw: rawText },
        { status: 500 }
      );
    }

    console.log(`[generate] success for platform: ${platform}`);
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[generate] error:`, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
