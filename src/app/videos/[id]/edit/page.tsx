"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video } from "@/types";
import { useVideos } from "@/components/VideosContext";
import { Spinner, Card } from "@/components/ui";
import VideoForm from "@/components/VideoForm";

export default function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { fetchVideoDetail, loading, error, username } = useVideos();
  const [video, setVideo] = useState<Video | null>(null);
  const router = useRouter();

  // Fetch the video details when the page loads
  useEffect(() => {
    fetchVideoDetail(id).then((v) => {
      setVideo(v);
      if (v && username && v.userId !== username) {
        router.replace(`/videos/${id}`);
      }
    });
  }, [id, username, router, fetchVideoDetail]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !video) {
    return (
      <Card className="p-8 w-full">
        <h2 className="text-xl font-bold mb-2 text-red-600">
          Error: {error || "Video not found"}
        </h2>
      </Card>
    );
  }

  return (
    <section className="flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-6">Edit Video</h2>
      <VideoForm
        video={video}
        onSubmit={(id) => router.push(id ? `/videos/${id}` : "/videos")}
      />
    </section>
  );
}
