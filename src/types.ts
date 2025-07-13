// Shared types

export interface Video {
  id: string;
  userId: string;
  title: string;
  videoUrl: string;
  description: string;
  createdAt: string;
  numComments: number;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  createdAt: string;
}
