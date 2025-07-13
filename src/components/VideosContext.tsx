"use client";

/*
 * This file contains the main context for the videos, including all the
 * API methods for fetching and mutation. Ideally it might be broken out
 * into separate contexts, or for a more complex app use Zustand stores
 * or another state manager.
 *
 * To use, wrap layout in VideosContext, and call useVideos() hook
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Video, Comment } from "@/types";
import { API_BASE_URL, KEY_IN_PROGRESS } from "@/constants";

type AddVideoProps = Omit<Video, "id" | "createdAt" | "numComments">;
type AddCommentProps = Omit<Comment, "id" | "createdAt">;

type VideosContextType = {
  videos?: Video[];
  username?: string;
  loading?: boolean;
  error?: string;
  inProgress: string[];
  fetchVideos: () => Promise<void>;
  fetchVideoDetail: (id: string) => Promise<Video | null>;
  fetchComments: (videoId: string) => Promise<Comment[]>;
  addVideo: (video: AddVideoProps) => Promise<boolean>;
  editVideo: (
    videoId: string,
    props: Partial<AddVideoProps>,
  ) => Promise<boolean>;
  addComment: (comment: AddCommentProps) => Promise<void>;
  markInProgress: (videoId: string) => void;
};

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export default function VideosProvider({
  username,
  children,
}: {
  username: string;
  children: ReactNode;
}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const [inProgress, setInProgress] = useState<string[]>(() => {
    const data = localStorage.getItem(KEY_IN_PROGRESS);
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY_IN_PROGRESS, JSON.stringify(inProgress));
    } catch {}
  }, [inProgress]);

  // Mark a video as in progress, kept in local storage
  const markInProgress = useCallback((videoId: string) => {
    setInProgress((prev) => {
      if (prev.includes(videoId)) return prev;
      const next = [...prev, videoId];
      localStorage.setItem(KEY_IN_PROGRESS, JSON.stringify(next));
      return next;
    });
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const response = await fetch(`${API_BASE_URL}/videos?user_id=${username}`);
    if (!response.ok) {
      setError("Failed to fetch videos");
      setLoading(false);
      return;
    }
    const data = await response.json();

    const videos: Video[] = data.videos
      .map(
        (v: {
          id: string;
          user_id: string;
          title: string;
          video_url: string;
          description: string;
          created_at: string;
          num_comments: number;
        }) => ({
          id: v.id,
          userId: v.user_id,
          title: v.title,
          videoUrl: v.video_url,
          description: v.description,
          createdAt: v.created_at,
          numComments: v.num_comments,
        }),
      )
      .sort(
        (a: Video, b: Video) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    setVideos(videos);
    setLoading(false);
  }, [username]);

  const fetchVideoDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(undefined);

    const response = await fetch(
      `${API_BASE_URL}/videos/single?video_id=${id}`,
    );
    if (!response.ok) {
      setError("Failed to fetch video detail");
      setLoading(false);
      return null;
    }
    const data = await response.json();

    const video: Video = {
      id: data.video.id,
      userId: data.video.user_id,
      title: data.video.title,
      videoUrl: data.video.video_url,
      description: data.video.description,
      createdAt: data.video.created_at,
      numComments: data.video.num_comments,
    };
    setLoading(false);
    return video ?? null;
  }, []);

  const fetchComments = useCallback(async (videoId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/videos/comments?video_id=${videoId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await response.json();
    const comments: Comment[] = data.comments
      .map(
        (c: {
          id: string;
          video_id: string;
          user_id: string;
          content: string;
          created_at: string;
        }) => ({
          id: c.id,
          videoId: c.video_id,
          userId: c.user_id,
          content: c.content,
          createdAt: c.created_at,
        }),
      )
      .sort(
        (a: Comment, b: Comment) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    return comments;
  }, []);

  const addVideo = useCallback(
    async (video: AddVideoProps) => {
      setLoading(true);
      setError(undefined);

      const resp = await fetch(`${API_BASE_URL}/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: video.userId,
          description: video.description,
          video_url: video.videoUrl,
          title: video.title,
        }),
      });
      if (!resp.ok) {
        setError("Failed to add video");
        setLoading(false);
        return false;
      }
      await fetchVideos();
      setLoading(false);
      return true;
    },
    [fetchVideos],
  );

  const editVideo = useCallback(
    async (videoId: string, props: Partial<AddVideoProps>) => {
      setLoading(true);
      setError(undefined);

      const resp = await fetch(`${API_BASE_URL}/videos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: videoId,
          description: props.description ?? undefined,
          video_url: props.videoUrl ?? undefined,
          title: props.title ?? undefined,
        }),
      });
      await fetchVideos();
      setLoading(false);
      if (!resp.ok) {
        setError("Failed to edit video");
        setLoading(false);
        return false;
      }
      return true;
    },
    [fetchVideos],
  );

  const addComment = useCallback(async (comment: AddCommentProps) => {
    const resp = await fetch(`${API_BASE_URL}/videos/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_id: comment.videoId,
        user_id: comment.userId,
        content: comment.content,
      }),
    });
    if (!resp.ok) {
      throw new Error("Failed to add comment");
    }
    setVideos((prev) =>
      prev.map((v) =>
        v.id === comment.videoId ? { ...v, numComments: v.numComments + 1 } : v,
      ),
    );
  }, []);

  return (
    <VideosContext.Provider
      value={{
        videos,
        loading,
        error,
        fetchVideos,
        fetchVideoDetail,
        fetchComments,
        addVideo,
        editVideo,
        addComment,
        username,
        inProgress,
        markInProgress,
      }}
    >
      {children}
    </VideosContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideosContext);
  if (!context)
    throw new Error("useVideos must be used within a VideosProvider");
  return context;
}
