import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video } from "@/types";
import { useVideos } from "@/components/VideosContext";
import { Button, Card } from "@/components/ui";

// Generic video form used for the add/edit pages

export default function VideoForm({
  video,
  onSubmit,
  onCancel,
}: {
  video?: Video;
  onSubmit?: (id?: string) => void;
  onCancel?: () => void;
}) {
  const isEdit = !!video;
  const [title, setTitle] = useState(video?.title || "");
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl || "");
  const [description, setDescription] = useState(video?.description || "");
  const { addVideo, editVideo, loading, error, username } = useVideos();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit && video) {
      const success = await editVideo(video.id, { title, description });
      if (success) onSubmit?.(video.id);
    } else {
      const success = await addVideo({
        title,
        videoUrl,
        description,
        userId: username || "",
      });
      if (success) onSubmit?.();
    }
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }

  return (
    <Card
      className={clsx(
        "bgshadow-md rounded-xl px-8 py-8 w-full",
        "max-w-lg border border-gray-300",
      )}
    >
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {isEdit && (
          <div className="flex flex-col gap-2">
            <label htmlFor="videoUrl">Video URL</label>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {videoUrl}
            </a>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={clsx(
              "border border-gray-300 rounded-lg",
              "px-3 py-2 transition bg-gray-50",
            )}
            required
            autoFocus
          />
        </div>
        {!isEdit && (
          <div className="flex flex-col gap-2">
            <label htmlFor="videoUrl">Video URL</label>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={clsx(
                "border border-gray-300 rounded-lg px-3 py-2",
                "transition bg-gray-50",
              )}
              required
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={clsx(
              "border border-gray-300 rounded-lg px-3 py-2",
              "transition bg-gray-50",
            )}
            required
          />
        </div>
        <div className="flex flex-row gap-3 justify-end mt-2">
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {isEdit ? "Update Video" : "Create Video"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
