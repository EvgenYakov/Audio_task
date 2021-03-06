import authReducer from "../Slice/AuthSlice";
import trackReducer from "../Slice/trackSlice";
import playlistReducer from "../Slice/PlaylistSlice";
import userReducer from "../Slice/UserSlice";
import {configureStore } from "@reduxjs/toolkit";

const reducer = {
    auth:authReducer,
    track:trackReducer,
    playlist:playlistReducer,
    user:userReducer
}

export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
})

