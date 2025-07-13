import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { Comment, Video } from "@/types";
import { useVideos } from "@/components/VideosContext";
import { Button, Spinner, Card } from "@/components/ui";

export default function CommentsList({ video }: { video: Video }) {
  const { addComment, username, fetchComments } = useVideos();
  const [comments, setComments] = useState<Comment[]>();
  const [newComment, setNewComment] = useState<
    Omit<Comment, "id" | "createdAt">
  >({
    videoId: video.id,
    userId: username || "",
    content: "",
  });
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComments(video.id)
      .then((c) => {
        setComments(c ?? []);
      })
      .catch((e) => {
        console.error(e);
        setComments([]);
      });
  }, [video.id, fetchComments]);

  useEffect(() => {
    if (username && !newComment.userId) {
      setNewComment((c) => ({ ...c, userId: username, videoId: video.id }));
    }
  }, [username, video, newComment.userId]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }
  }, [comments?.length]);

  const handleAddComment = async () => {
    if (!comments || !newComment.userId.trim() || !newComment.content.trim())
      return;
    try {
      await addComment(newComment);
      setNewComment({ ...newComment, content: "" });
      const newComments = await fetchComments(video.id);
      setComments(newComments ?? []);
    } catch (e) {
      console.error(e);
      alert("Failed to add comment");
    }
  };

  return (
    <Card
      className={clsx(
        "w-full md:max-w-md shadow-lg bg-white flex flex-col mt-8 md:mt-10",
        "p-4 border-t md:border-t-0 md:border-l border-gray-200",
        "md:min-h-[70dvh] md:max-h-[70dvh]",
      )}
    >
      <h3 className="text-lg font-semibold mb-0 mt-0">Comments</h3>
      <div
        className={clsx(
          "flex-1 overflow-y-auto mb-4 flex flex-col gap-4 min-h-[120px]",
        )}
      >
        {!comments && <Spinner className="mt-4" />}
        {comments && (comments.length ?? 0) === 0 ? (
          <div className="text-gray-400 text-sm">No comments yet.</div>
        ) : (
          comments?.map((c, i) => (
            <Card
              key={c.id ?? i}
              className={clsx(
                "shadow rounded-lg bg-gray-50 px-4 py-2 flex flex-col max-w-xs",
                "border border-gray-300",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{c.userId}</span>
                {c.createdAt && (
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(c.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                )}
              </div>
              <span className="text-gray-800">{c.content}</span>
            </Card>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          placeholder="Add a comment..."
          className="rounded px-2 py-1 text-sm resize-none shadow shadow-gray-400"
          rows={2}
          value={newComment.content}
          onChange={(e) =>
            setNewComment({ ...newComment, content: e.target.value })
          }
        />
        <div className="flex items-center gap-2 w-full justify-end">
          <label
            htmlFor="userId"
            className="text-xs text-gray-500 whitespace-nowrap"
          >
            As User ID:
          </label>
          <input
            id="userId"
            type="text"
            placeholder="Commenter's username"
            className="rounded px-2 py-1 text-sm shadow shadow-gray-400 flex-1"
            value={newComment.userId}
            onChange={(e) =>
              setNewComment({ ...newComment, userId: e.target.value })
            }
            required
          />
        </div>
        <Button
          type="button"
          onClick={handleAddComment}
          disabled={!newComment.userId?.trim() || !newComment.content?.trim()}
          variant="primary"
        >
          Add Comment
        </Button>
      </div>
    </Card>
  );
}
