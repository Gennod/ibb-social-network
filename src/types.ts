import { User } from "firebase/auth"

export interface Post {
    id: string,
    content: string,
    createdAt: Date,
    createdBy: string,
    likes: string[]
}

export interface PostState {
    posts: Post[],
    status: "idle" | "loading" | "succeeded" | "failed"
}

export interface AuthState {
    user: User | null,
    status: "idle" | "loading" | "succeed" | "failed",
    error: string | null
}