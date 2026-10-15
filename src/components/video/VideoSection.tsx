import { VideoPlayer } from "./VideoPlayer";
import { FileVideo } from "lucide-react";

interface VideoSectionProps {
  title: string;
  description?: string;
  videos: Array<{
    src: string;
    poster?: string;
    title?: string;
    type?: "video" | "youtube";
  }>;
  className?: string;
}

export function VideoSection({ title, description, videos, className }: VideoSectionProps) {
  return (
    <section className={`py-16 lg:py-24 ${className || ""}`} aria-labelledby="video-heading">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 id="video-heading" className="text-3xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video, index) => (
            <div key={index} className="space-y-4">
              {video.type === "youtube" ? (
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={video.src}
                    title={video.title || title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <VideoPlayer
                  src={video.src}
                  poster={video.poster}
                  title={video.title}
                  className="aspect-video"
                />
              )}
              {video.title && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                    <FileVideo className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{video.title}</h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
