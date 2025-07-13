import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Video } from "@/types";
import { Pencil, Maximize } from "lucide-react";
import { useVideos } from "@/components/VideosContext";
import { Button } from "@/components/ui";

/* Displays the video information and player. An HTML5 player is used for now,
 * but plyr-react would be more ideal
 */
export default function VideoDetail({ video }: { video: Video }) {
  const { username, markInProgress } = useVideos();
  const isOwner = username && video.userId === username;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handlePlay = () => {
      markInProgress(video.id);
    };
    const handleRateChange = () => {
      setPlaybackRate(el.playbackRate);
    };
    el.addEventListener("play", handlePlay);
    el.addEventListener("ratechange", handleRateChange);
    return () => {
      el.removeEventListener("play", handlePlay);
      el.removeEventListener("ratechange", handleRateChange);
    };
  }, [video.id, markInProgress]);

  return (
    <div
      className={clsx(
        "aspect-video flex flex-col gap-2 flex-1 w-full md:max-w-[900px]",
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{video.title}</h2>
      </div>
      <div className="relative w-full">
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          className="w-full rounded-lg bg-black"
        />
      </div>

      {video.createdAt &&
        (() => {
          const d = new Date(video.createdAt);
          return (
            <div
              className={clsx(
                "flex items-center justify-between text-xs",
                "text-gray-500 mt-2 mb-1 w-full",
              )}
            >
              <span>
                Uploaded{" "}
                {d.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link href={`/videos/${video.id}/edit`}>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-base"
                    >
                      <Pencil size={20} />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-base"
                    onClick={() => {
                      videoRef.current?.requestFullscreen();
                    }}
                    aria-label="Fullscreen"
                  >
                    <Maximize size={20} />
                  </Button>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={playbackRate}
                    aria-label="Playback speed"
                    onChange={(e) => {
                      if (!videoRef.current) return;
                      const rate = Number(e.target.value);
                      videoRef.current.playbackRate = rate;
                      setPlaybackRate(rate);
                    }}
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              )}
            </div>
          );
        })()}
      <p className="text-gray-700">{video.description}</p>
    </div>
  );
}
