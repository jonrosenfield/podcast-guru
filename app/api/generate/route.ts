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

function buildSystemPrompt(platforms: string[]): string {
  const sections = platforms
    .map((p) => `### PLATFORM: ${p.toUpperCase()}\n${PLATFORM_PROMPTS[p]}`)
    .join('\n\n---\n\n');

  return `You are an expert content strategist for the "F Your Feelings" (FYF) podcast.
Generate content for all requested platforms in a single response.

${sections}

---

## COMBINED OUTPUT RULE (overrides all individual platform instructions above)
Return ONE valid JSON object with a key for each platform. No markdown fences, no explanation — raw JSON only.
Example shape:
{
  "youtube":   { ...as specified in the YOUTUBE section },
  "thumbnail": { ...as specified in the THUMBNAIL section },
  "podcast":   { ...as specified in the PODCAST section },
  "social":    [ ...array as specified in the SOCIAL section ]
}
Only include keys for the platforms listed in the user message.`;
}

function buildUserMessage(params: {
  platforms: string[];
  episodeNumber: string;
  episodeTopic: string;
  episodeTranscript: string;
  shortClips?: { label: string; transcript: string }[];
}): string {
  const { platforms, episodeNumber, episodeTopic, episodeTranscript, shortClips } = params;

  const header = [
    `Platforms to generate: ${platforms.join(', ')}`,
    episodeNumber ? `Episode Number: ${episodeNumber}` : null,
    episodeTopic  ? `Episode Topic: ${episodeTopic}`   : null,
  ].filter(Boolean).join('\n');

  const clipsSection = platforms.includes('social') && shortClips?.length
    ? `\n\nSHORT CLIPS TO PROCESS (for the social platform):\n${shortClips
        .map((c, i) => `--- CLIP ${i + 1}: ${c.label} ---\n${c.transcript}`)
        .join('\n\n')}`
    : '';

  return `${header}\n\nFULL EPISODE TRANSCRIPT:\n${episodeTranscript}${clipsSection}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platforms, episodeNumber, episodeTopic, episodeTranscript, shortClips } = body;

    if (!platforms?.length || !episodeTranscript) {
      return NextResponse.json({ error: 'Missing platforms or transcript' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set. Add it to your .env.local file.' },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(platforms);
    const userMessage  = buildUserMessage({
      platforms,
      episodeNumber: episodeNumber ?? '',
      episodeTopic:  episodeTopic  ?? '',
      episodeTranscript,
      shortClips,
    });

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 8192,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userMessage }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    let results;
    try {
      results = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Claude returned invalid JSON. Try again.', raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
