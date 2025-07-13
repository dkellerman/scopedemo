import clsx from "clsx";
import { useMemo, useEffect } from "react";
import Link from "next/link";
import { PlayCircle, MessageCircle } from "lucide-react";
import { useVideos } from "@/components/VideosContext";
import { Spinner } from "./ui";

// Displays grid of user videos, ideally would have pagination
export default function VideosList() {
  const { videos, loading, error, inProgress, fetchVideos } = useVideos();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const sortedVideos = useMemo(() => {
    if (!videos) return [];
    return [...videos].sort((a, b) => {
      const aInProgress = inProgress.includes(a.id);
      const bInProgress = inProgress.includes(b.id);
      if (aInProgress && !bInProgress) return -1;
      if (!aInProgress && bInProgress) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [videos, inProgress]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (!videos?.length) {
    return <p>No videos found</p>;
  }

  return (
    <ul
      className={clsx(
        "w-full max-w-[900px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6",
      )}
    >
      {sortedVideos.map((video) => (
        <li key={video.id} className="w-full h-fit">
          <Link
            href={`/videos/${video.id}`}
            className={clsx(
              "max-w-[320px] mx-auto rounded-xl border border-gray-300",
              "overflow-hidden bg-white h-[280px] flex flex-col",
              "transition-transform hover:scale-105 relative",
            )}
          >
            <div
              className={clsx(
                "w-full h-[180px] bg-gray-100 flex flex-col items-center",
                "justify-center rounded-t-xl relative",
              )}
            >
              <PlayCircle size={48} className="text-gray-400" />
              {inProgress.includes(video.id) && (
                <span
                  className={clsx(
                    "mt-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800",
                    "rounded text-center",
                  )}
                >
                  in progress
                </span>
              )}
              {video.numComments > 0 && (
                <span
                  className={clsx(
                    "absolute top-2 right-2 flex items-center gap-1 bg-blue-100",
                    "text-blue-700 rounded-full px-2 py-0.5 text-xs shadow-sm",
                  )}
                >
                  <MessageCircle size={16} className="inline-block" />
                  {video.numComments}
                </span>
              )}
            </div>
            <div
              className={clsx(
                "p-4 border-t border-gray-300 bg-white rounded-b-xl flex-1",
                "flex flex-col overflow-hidden",
              )}
            >
              <div
                className={clsx(
                  "text-md font-bold text-blue-700 w-full",
                  "text-ellipsis overflow-hidden whitespace-nowrap",
                )}
                title={video.title}
              >
                {video.title}
              </div>
              <div
                className={clsx(
                  "text-gray-500 text-sm w-full text-ellipsis overflow-hidden",
                  "line-clamp-2 mt-1",
                )}
                title={video.description}
              >
                {video.description}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
