// ============================================================
// PODCAST GURU — MASTER PROMPT BUILDER
// Builds ready-to-paste prompts for claude.ai (no API needed)
// ============================================================

export interface PromptInputs {
  episodeNumber: string;
  episodeTopic: string;
  episodeTranscript: string;
  shortClips: { label: string; transcript: string }[];
  platforms: string[];
}

// ─── FYF Brand Context (shared across all prompts) ───────────
const FYF_CONTEXT = `
## ABOUT THE PODCAST: F YOUR FEELINGS (FYF)
- Hosts: Anthony, Daniel, and Eric
- Tagline: "We say what you're thinking but shouldn't say out loud"
- Voice: Raw, unfiltered, irreverent, humor-forward, unapologetically honest
- Topics: Personal stories, sports (Miami Dolphins/NFL), true crime, conspiracies, nostalgia, hot takes on everyday life
- Handle: @fyourfeelingspod on all platforms
- Platforms: YouTube, Spotify, Apple Podcasts, Instagram, TikTok, Facebook
- Audience: Adults 18–45 who are tired of sanitized, politically correct content
- Brand feel: "The conversation you have at 2 AM after three drinks"
- Current stage: Growing show (18+ episodes), strong Facebook traction, building YouTube + podcast app presence
`.trim();

// ─── YouTube Prompt ──────────────────────────────────────────
function buildYouTubePrompt(inputs: PromptInputs): string {
  return `You are an expert YouTube growth strategist specializing in podcast content. Analyze this F Your Feelings (FYF) podcast episode and generate complete YouTube marketing assets.

${FYF_CONTEXT}

## YOUTUBE STRATEGY CONTEXT
FYF has strong Facebook engagement and is now building YouTube. The goal is to crack YouTube's algorithm by:
- Maximizing click-through rate (CTR) with irresistible titles
- Creating descriptions that hook in the first line (shows before "Show more")
- Using tags that balance broad discovery with niche relevance
- Adding chapters that keep viewers watching longer

## EPISODE INFO
Episode Number: ${inputs.episodeNumber || 'TBD'}
Working Title / Topic: ${inputs.episodeTopic || 'Not specified'}

## EPISODE TRANSCRIPT
${inputs.episodeTranscript}

---

## GENERATE THE FOLLOWING:

### 1. EPISODE TITLES (give 5 options)
For each title, note the angle (e.g. Curiosity Hook, Relatable Story, Hot Take, SEO-Optimized). Keep under 60 characters. FYF voice — raw, punchy, no corporate speak.

### 2. YOUTUBE DESCRIPTION
**First Line** (what shows before "Show more" — make it unmissable):
Then the full description (150–250 words): episode hook, what listeners will hear, timestamps placeholder [00:00], links, CTA. SEO-rich but sounds human. End with: Subscribe @fyourfeelingspod

### 3. YOUTUBE TAGS
15–20 tags. Mix: broad (podcast, comedy) + niche (Miami Dolphins, unfiltered podcast, hot takes) + FYF brand (fyourfeelings, fyourfeelingspod, f your feelings podcast)

### 4. CHAPTER TIMESTAMPS
Infer chapter breaks from the transcript flow. Format:
0:00 Intro
[time] [topic]
...
Use at minimum: Intro, 3–4 topic sections, Outro

### 5. END SCREEN CTA (15–20 second script)
What Anthony, Daniel, or Eric should say over the end screen to drive subscribe + watch next episode.`;
}

// ─── Thumbnail Prompt ────────────────────────────────────────
function buildThumbnailPrompt(inputs: PromptInputs): string {
  return `You are a world-class YouTube thumbnail strategist. Generate detailed thumbnail creative briefs for this F Your Feelings (FYF) podcast episode.

${FYF_CONTEXT}

## THUMBNAIL PRINCIPLES FOR FYF
- Stop the scroll in under 0.5 seconds
- High contrast, punchy colors — NOT corporate or polished
- Host expressions: genuine shock, laughter, disbelief, eye-roll
- Bold text overlays: 3–5 words MAX, readable on mobile
- Think: "What makes someone stop and go WTF?"
- Works at small sizes (most YouTube is mobile)

## EPISODE INFO
Episode Number: ${inputs.episodeNumber || 'TBD'}
Working Title / Topic: ${inputs.episodeTopic || 'Not specified'}

## EPISODE TRANSCRIPT
${inputs.episodeTranscript}

---

## GENERATE 2 THUMBNAIL CONCEPTS

For each concept, provide:

**CONCEPT NAME:** (e.g. "Shock Reaction", "Bold Statement", "Story Hook")
**ONE-LINE IDEA:** What's the visual concept in one sentence?
**BACKGROUND:** Color scheme, setting, or scene description
**FOREGROUND / HOSTS:** Which hosts (Anthony, Daniel, Eric), what expression/pose/prop
**TEXT OVERLAY:**
  - Main text (2–4 words, BOLD)
  - Sub text (optional, smaller)
  - Placement (top/bottom/left/right)
  - Style (color, outline, shadow)
**COLOR PALETTE:** 3–4 specific colors
**EMOTION IT TRIGGERS:** What does the viewer feel instantly?
**MOBILE CHECK:** How does it read at thumbnail size on a phone screen?
**MIDJOURNEY PROMPT:** A ready-to-use prompt to generate the background/concept
**DESIGNER NOTES:** Any additional instructions

Then:
**A/B TEST RECOMMENDATION:** Which concept to test first and why
**DO NOT DO LIST:** 5 things to specifically avoid for THIS episode's thumbnail`;
}

// ─── Podcast Platforms Prompt ─────────────────────────────────
function buildPodcastPrompt(inputs: PromptInputs): string {
  return `You are a podcast platform optimization expert. Generate Spotify and Apple Podcasts marketing assets for this F Your Feelings (FYF) episode.

${FYF_CONTEXT}

## PLATFORM STRATEGY
- Spotify and Apple Podcasts reward: strong first-line hooks, keyword-rich descriptions, correct categories
- Episode titles need to be searchable AND scroll-stopping (under 65 characters)
- First 2 sentences are preview text — make them magnetic
- Apple Podcasts rewards ratings, reviews, consistent publishing

## EPISODE INFO
Episode Number: ${inputs.episodeNumber || 'TBD'}
Working Title / Topic: ${inputs.episodeTopic || 'Not specified'}

## EPISODE TRANSCRIPT
${inputs.episodeTranscript}

---

## GENERATE THE FOLLOWING:

### 1. EPISODE TITLES (4 options)
Angles: Story Hook / Topic Debate / Relatable Emotion / Curiosity Gap. All under 65 chars, FYF voice.

### 2. SPOTIFY PREVIEW LINE
The opening sentence Spotify shows as a preview — must make someone hit play.

### 3. APPLE PODCASTS PREVIEW LINE
Slightly different angle — what Apple shows in its preview.

### 4. SHORT DESCRIPTION (80–100 words)
Hook, what listeners will hear, why they should care. FYF voice.

### 5. FULL DESCRIPTION (200–250 words)
Full episode description including: hook, key topics/moments, CTA to follow @fyourfeelingspod. Note if explicit content applies.

### 6. SEARCH KEYWORDS
10–15 keywords a new listener might search to find this episode

### 7. APPLE PODCASTS CATEGORIES
Best primary category + secondary category for discovery

### 8. SHOW NOTES HIGHLIGHTS
5 bullet points for show notes. Key moments with timestamp placeholders.
Format: [00:00] — Description of moment`;
}

// ─── Social / Clips Prompt ───────────────────────────────────
function buildSocialPrompt(inputs: PromptInputs): string {
  const clipsSection = inputs.shortClips.length > 0
    ? inputs.shortClips.map((clip, i) =>
        `### CLIP ${i + 1}: ${clip.label}\n${clip.transcript}`
      ).join('\n\n---\n\n')
    : 'No clip transcripts provided — generate social content based on the episode transcript highlights instead.';

  return `You are a viral social media strategist specializing in short-form podcast content. Generate platform-specific social media content for these F Your Feelings (FYF) clips.

${FYF_CONTEXT}

## WHAT MAKES FYF CONTENT GO VIRAL
- Moments of genuine shock, laughter, or "I can't believe they said that"
- Hot takes people HAVE to respond to (agree or disagree)
- Relatable moments that make people tag friends
- Sports takes (especially Dolphins/NFL) that trigger fan passion
- "Did they just say that?!" moments

## PLATFORM RULES
- **Instagram Reels:** 3–10 hashtags, hook first, conversational caption
- **YouTube Shorts:** 2–4 hashtags max, title is everything
- **TikTok:** First 1–2 seconds = everything, text overlay matters
- **Facebook:** FYF's home turf — longer captions work, story-driven, shareable

## EPISODE CONTEXT
Episode ${inputs.episodeNumber || '?'}: ${inputs.episodeTopic || 'FYF Episode'}

## CLIP TRANSCRIPTS
${clipsSection}

---

## FOR EACH CLIP, GENERATE:

**VIRAL HOOK:** The single most shareable/quotable moment (1–2 sentences)

**INSTAGRAM REELS:**
- Caption (100–150 words, hook first, FYF voice, CTA)
- Hashtags (8–12: mix of niche + broad + FYF brand)
- Alt Caption A (under 50 words — for A/B testing)
- Alt Caption B (under 50 words — different angle)

**YOUTUBE SHORTS:**
- Title (under 60 chars — curiosity or bold statement)
- Description (2–3 sentences + @fyourfeelingspod)
- Hashtags (#Shorts + 2–3 relevant)

**FACEBOOK:**
- Caption (150–200 words, story-driven — this is FYF's strongest platform)
- Engagement question to end with (drives comments)

**TIKTOK:**
- Caption (under 80 chars, punchy)
- On-screen text overlay suggestion (what to display during the clip)
- Hashtags (4–6)

**BEST PLATFORM FOR THIS CLIP:** Which to prioritize and why (1 sentence)`;
}

// ─── Master Prompt Builder ───────────────────────────────────
export function buildPrompts(inputs: PromptInputs): Record<string, string> {
  const prompts: Record<string, string> = {};

  if (inputs.platforms.includes('youtube')) {
    prompts.youtube = buildYouTubePrompt(inputs);
  }
  if (inputs.platforms.includes('thumbnail')) {
    prompts.thumbnail = buildThumbnailPrompt(inputs);
  }
  if (inputs.platforms.includes('podcast')) {
    prompts.podcast = buildPodcastPrompt(inputs);
  }
  if (inputs.platforms.includes('social')) {
    prompts.social = buildSocialPrompt(inputs);
  }

  return prompts;
}

export const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube Strategy',
  thumbnail: 'Thumbnail Briefs',
  podcast: 'Spotify / Apple Podcasts',
  social: 'Social Media / Clips',
};

export const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#ff0000',
  thumbnail: '#f39c12',
  podcast: '#1db954',
  social: '#e1306c',
};
