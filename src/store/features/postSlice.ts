import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Post, PostState } from "../../types";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  QuerySnapshot,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const initialState: PostState = {
  posts: [],
  status: "idle",
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
});

export const subscribeToPosts = createAsyncThunk(
  "posts/subscribe",
  (_, { dispatch }) => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    return new Promise<void>((resolve, reject) => {
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          dispatch(setPosts(posts));
          resolve();
        },
        (error) => reject(error)
      );
    });
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (content: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authenticated");

    const newPost = {
      content,
      likes: [],
      createdBy: user.uid,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);
    return { id: docRef.id, ...newPost };
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authenticated");

    const docRef = doc(db, "posts", postId);
    const post = (await getDoc(docRef)).data() as Post;

    const newLikes = post.likes.includes(user.uid)
      ? post.likes.filter((uid) => uid !== user.uid)
      : [...post.likes, user.uid];

    await updateDoc(docRef, { likes: newLikes });
    return { postId, likes: newLikes };
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authenticated");

    try {
      const docRef = doc(db, "posts", postId);
      await deleteDoc(docRef);
      const allPosts = await getDocs(collection(db, "posts"));

      const newPosts = allPosts.docs.filter((doc) => doc.id !== postId);

      return newPosts.map((post) => ({
        id: post.id,
        ...post.data(),
      })) as Post[];
    } catch (error) {
      if (error instanceof Error) {
        return console.error(error)
      }
      return console.error("Не удалось удалить пост");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);

        if (post) post.likes = action.payload.likes;
      })
      .addCase(subscribeToPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subscribeToPosts.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(subscribeToPosts.rejected, (state, action) => {
        state.status = "failed";
        console.error("Ошибка подписки:", action.error);
      })
  },
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;
