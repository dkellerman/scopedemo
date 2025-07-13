"use client";

import { useRouter } from "next/navigation";
import VideoForm from "@/components/VideoForm";

export default function NewVideoPage() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-6">Add New Video</h2>
      <VideoForm
        onSubmit={(id) => router.push(id ? `/videos/${id}` : "/videos")}
      />
    </section>
  );
}
