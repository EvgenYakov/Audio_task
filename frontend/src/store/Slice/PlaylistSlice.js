import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getTracks} from "./trackSlice";
import playlistService from "../actions/playlistService";
import authService from "../actions/authServise";



const initialState = {
    playlists: [],
    isPlstError: false,
    isPlstSuccess: false,
    isPlstLoading: false,
    plstMessage: '',
}

export const addPlaylist = createAsyncThunk(
    'playlist/add',
    async (playlistData, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await playlistService.addPlaylist(playlistData,token)
        }catch (e) {
            if (e.response.status === 401) return thunkAPI.rejectWithValue(e.response.status)
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
            const token = await authService.checkRefresh();
            thunkAPI.dispatch(getTracks())
            return await playlistService.getPlaylist(token)
        }catch (e) {
            if (e.response.status === 401) return thunkAPI.rejectWithValue(e.response.status)
            const mes =
                (e.response && e.response.data && e.response.data.message) ||
                e.message ||
                e.toString()
            return thunkAPI.rejectWithValue(mes)
        }
    }
)

export const putPlaylist = createAsyncThunk(
    'playlist/put',
    async (playlistData, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await playlistService.putPlaylist(playlistData,token)
        }catch (e) {
            if (e.response.status === 401) return thunkAPI.rejectWithValue(e.response.status)
            const mes =
                (e.response && e.response.data && e.response.data.message) ||
                e.message ||
                e.toString()
            return thunkAPI.rejectWithValue(mes)
        }
    }
)

export const deletePlaylist = createAsyncThunk(
    'playlist/delete',
    async (playlistId, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await playlistService.deletePlaylist(playlistId,token)
        }catch (e) {
            if (e.response.status === 401) return thunkAPI.rejectWithValue(e.response.status)
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
                state.isPlstLoading = false
                state.isPlstSuccess = true
                state.playlists.push(action.payload)
            })
            .addCase(addPlaylist.rejected, (state, action) => {
                state.isPlstLoading = false
                state.isPlstError = true
                state.plstMessage = action.payload
            })
            .addCase(getPlaylist.pending, (state) => {
                state.isPlstLoading = true;
            })
            .addCase(getPlaylist.fulfilled, (state, action) => {
                state.isPlstLoading = false
                state.isPlstSuccess = true
                state.playlists = action.payload
            })
            .addCase(getPlaylist.rejected, (state, action) => {
                state.isPlstLoading = false
                state.isPlstError = true
                state.plstMessage = action.payload
            })
            .addCase(putPlaylist.pending, (state) => {
                state.isPlstLoading = true;
            })
            .addCase(putPlaylist.fulfilled, (state, action) => {
                state.isPlstLoading = false
                state.isPlstSuccess = true
                state.playlists.splice(state.playlists.findIndex(obj=>obj._id===action.payload._id),1,action.payload)
            })
            .addCase(putPlaylist.rejected, (state, action) => {
                state.isPlstLoading = false
                state.isPlstError = true
                state.plstMessage = action.payload
            })
            .addCase(deletePlaylist.pending, (state) => {
                state.isPlstLoading = true;
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.isPlstLoading = false
                state.isPlstSuccess = true
                state.playlists = state.playlists.filter((plst)=> plst._id !== action.payload.id)
            })
            .addCase(deletePlaylist.rejected, (state, action) => {
                state.isPlstLoading = false
                state.isPlstError = true
                state.plstMessage = action.payload
            })
        }
    })


export const {resetPLaylist} = playlistSlice.actions
export default playlistSlice.reducer