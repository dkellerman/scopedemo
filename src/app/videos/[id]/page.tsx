"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Video } from "@/types";
import { useVideos } from "@/components/VideosContext";
import VideoDetail from "@/components/VideoDetail";
import CommentsList from "@/components/CommentsList";
import { Spinner } from "@/components/ui";

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { fetchVideoDetail, loading, error } = useVideos();
  const [video, setVideo] = useState<Video | null>(null);

  // Fetch the video details when the page loads
  useEffect(() => {
    fetchVideoDetail(id).then(setVideo);
  }, [id, fetchVideoDetail]);

  if (loading) return <Spinner />;

  return (
    <section>
      <Link href="/videos" className="text-blue-600 hover:underline mb-4">
        ← Back to Videos
      </Link>

      <div className="flex flex-col md:flex-row gap-12 items-start mt-4 min-h-[80dvh]">
        {error || !video ? (
          <h2 className="text-xl font-bold mb-2 text-red-600">
            Error: {error || "Video not found"}
          </h2>
        ) : (
          <>
            <VideoDetail video={video} />
            {video && <CommentsList video={video} />}
          </>
        )}
      </div>
    </section>
  );
}
