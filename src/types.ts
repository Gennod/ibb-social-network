import { User } from "firebase/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | undefined | null;
}

export interface Comment {
  content: string;
  id: string;
  createdAt: string;
  authorId: string;
  likes: string[];
  authorName: string;
  authorPhotoURL?: string; 
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  likes: string[];
  authorName: string;
  comments: Comment[]
}



export interface PostState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

export interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
