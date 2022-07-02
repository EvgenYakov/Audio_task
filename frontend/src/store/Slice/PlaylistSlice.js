import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {addTrack, trackSlice} from "./trackSlice";
import playlistService from "../actions/playlistService";



const initialState = {
    playlists: [],
    isError: false,
    isSuccess: false,
    playlistLoading: false,
    message: '',
}

export const addPlaylist = createAsyncThunk(
    'playlist/add',
    async (playlistData, thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await playlistService.addPlaylist(playlistData,token)
        }catch (e) {
            const mes =
                (e.response && e.response.data && e.response.data.message) ||
                e.message ||
                e.toString()
            return thunkAPI.rejectWithValue(mes)
        }
    }
)


export const getPlaylist = createAsyncThunk(
    'playlist/get',
    async (playlistData, thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await playlistService.getPlaylist(token)
        }catch (e) {
            const mes =
                (e.response && e.response.data && e.response.data.message) ||
                e.message ||
                e.toString()
            return thunkAPI.rejectWithValue(mes)
        }
    }
)

export const playlistSlice = createSlice({
    name:'playlist',
    initialState,
    reducers:{resetPLaylist:(state)=>initialState},
    extraReducers:builder => {
        builder
            .addCase(addPlaylist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addPlaylist.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.playlists.push(action.payload)
            })
            .addCase(addPlaylist.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getPlaylist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPlaylist.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.playlists = action.payload
            })
            .addCase(getPlaylist.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
        }
    })


export const {resetPLaylist} = playlistSlice.actions
export default playlistSlice.reducer