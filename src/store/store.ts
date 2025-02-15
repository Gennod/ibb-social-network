import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./features/postSlice"
import authReducer from "./features/authSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        posts: postReducer,
        auth: authReducer
    }
})


//типы
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//типизированные хуки
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector