import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState } from "../../types";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";


const initialState: AuthState = {
    user: null,
    status: "idle",
    error: null
}

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async () => {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
})

export const logout = createAsyncThunk("auth/logout", async () => {
    await signOut(auth)
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.status = "idle"
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.status = "succeed"
                state.user = action.payload
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message || "Login failed"
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    }
})
export const {setUser} = authSlice.actions
export default authSlice.reducer