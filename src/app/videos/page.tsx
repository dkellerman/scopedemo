"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import VideosList from "@/components/VideosList";
import { useVideos } from "@/components/VideosContext";

export default function VideosPage() {
  const router = useRouter();
  const { username } = useVideos();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 hidden md:block">
        Welcome, {username}!
      </h2>

      <div className="flex justify-center md:justify-start items-center mb-8">
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            router.push("/videos/new");
          }}
          className="text-sm"
        >
          <Plus size={18} />
          Add video
        </Button>
      </div>

      <VideosList />
    </section>
  );
}
