export interface ShortClip {
  id: string;
  label: string;
  transcript: string;
}

export interface GenerateRequest {
  episodeTranscript: string;
  episodeNumber?: string;
  episodeTopic?: string;
  shortClips: ShortClip[];
  platforms: ('youtube' | 'podcast' | 'social' | 'thumbnail')[];
}

// ─── YouTube Types ───────────────────────────────────────────
export interface YouTubeChapter {
  time: string;
  title: string;
}

export interface YouTubeThumbnailBrief {
  conceptName: string;
  concept: string;
  background: string;
  foreground: string;
  textOverlay: {
    mainText: string;
    subText: string;
    placement: string;
    style: string;
  };
  colorPalette: string[];
  emotionTarget: string;
  mobileNotes: string;
  midjourneyPrompt: string;
  designerNotes: string;
}

export interface YouTubeResults {
  titles: string[];
  description: {
    full: string;
    firstLine: string;
  };
  tags: string[];
  chapters: YouTubeChapter[];
  thumbnailBriefs: YouTubeThumbnailBrief[];
  endScreenCTA: string;
}

// ─── Podcast Platform Types ──────────────────────────────────
export interface ShowNoteHighlight {
  timestamp: string;
  highlight: string;
}

export interface PodcastResults {
  episodeTitles: string[];
  descriptions: {
    short: string;
    long: string;
    spotifyFirstLine: string;
    appleFirstLine: string;
  };
  keywords: string[];
  categories: {
    primary: string;
    secondary: string;
  };
  episodeType: string;
  contentWarnings: string;
  showNotesHighlights: ShowNoteHighlight[];
}

// ─── Social / Clip Types ─────────────────────────────────────
export interface SocialClipResult {
  clipIndex: number;
  clipTitle: string;
  viralHook: string;
  instagram: {
    caption: string;
    hashtags: string[];
    altCaptions: string[];
  };
  youtube: {
    title: string;
    description: string;
    hashtags: string[];
  };
  facebook: {
    caption: string;
    engagementQuestion: string;
  };
  tiktok: {
    caption: string;
    textOverlaySuggestion: string;
    hashtags: string[];
  };
  bestPlatformRecommendation: string;
}

// ─── Thumbnail Types ─────────────────────────────────────────
export interface ThumbnailResults {
  thumbnails: YouTubeThumbnailBrief[];
  abTestRecommendation: string;
  avoidList: string[];
}

// ─── Final Response ──────────────────────────────────────────
export interface GenerateResponse {
  youtube?: YouTubeResults;
  podcast?: PodcastResults;
  social?: SocialClipResult[];
  thumbnail?: ThumbnailResults;
  error?: string;
}
