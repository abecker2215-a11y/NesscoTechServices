/**
 * Video proof library — "watch us fix it" clips per service.
 *
 * To publish a video for a service:
 *  1. Upload to YouTube (unlisted is fine) or host the mp4 yourself.
 *  2. Add an entry below keyed by the service slug (see src/lib/services.ts).
 *  3. The service page renders the section automatically, with VideoObject
 *     JSON-LD for SEO. Pages without entries render nothing.
 *
 * Keep clips 30–90 seconds: state the symptom, show the fix, state the
 * outcome + price. No jargon.
 */

export type VideoProvider = "youtube" | "vimeo" | "mp4";

export interface ServiceVideo {
  /** Stable id, e.g. "slow-wifi-fix" */
  id: string;
  title: string;
  /** Plain-English outcome, e.g. "Dead-zone Wi-Fi fixed in one visit — $250" */
  outcome: string;
  /** mm:ss */
  duration: string;
  provider: VideoProvider;
  /** YouTube/Vimeo video id, or full mp4 URL */
  src: string;
  /** Poster image path under /public (optional) */
  poster?: string;
  /** 1–2 sentence transcript summary (used for SEO + accessibility) */
  transcript: string;
  uploadDate: string;
}

export const serviceVideos: Record<string, ServiceVideo[]> = {
  // Example (uncomment + fill in when the first clip is published):
  // "wifi-networking": [
  //   {
  //     id: "dead-zone-fix",
  //     title: "Watch us fix a dead-zone Wi-Fi in one visit",
  //     outcome: "Full bars everywhere — $250 flat",
  //     duration: "1:12",
  //     provider: "youtube",
  //     src: "VIDEO_ID_HERE",
  //     transcript: "…",
  //     uploadDate: "2026-01-15",
  //   },
  // ],
};

export function getVideosForService(slug: string): ServiceVideo[] {
  return serviceVideos[slug] ?? [];
}

export function videoEmbedUrl(video: ServiceVideo): string {
  if (video.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${video.src}?rel=0`;
  }
  if (video.provider === "vimeo") {
    return `https://player.vimeo.com/video/${video.src}`;
  }
  return video.src;
}

export function videoWatchUrl(video: ServiceVideo): string {
  if (video.provider === "youtube") return `https://www.youtube.com/watch?v=${video.src}`;
  if (video.provider === "vimeo") return `https://vimeo.com/${video.src}`;
  return video.src;
}

export function videoObjectSchema(video: ServiceVideo, _pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: `${video.outcome}. ${video.transcript}`,
    thumbnailUrl: video.poster ? [`https://nesscotech.com${video.poster}`] : undefined,
    uploadDate: video.uploadDate,
    duration: `PT${video.duration.replace(":", "M")}S`,
    embedUrl: video.provider === "mp4" ? undefined : videoEmbedUrl(video),
    contentUrl: video.provider === "mp4" ? video.src : videoWatchUrl(video),
  };
}
