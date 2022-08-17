import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import trackService from "../actions/trackService";
import authService from '../actions/authServise'


// Get user from localStorage
const initialState = {
    tracks: [],
    infoOneTrack:{},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    viewAdded:false
}

export const addTrack = createAsyncThunk(
    'music/add',
    async (trackData, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await trackService.addTrack(trackData,token)
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

export const getTracks = createAsyncThunk(
    'music/get',
    async (_,thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await trackService.getTracks(token)
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

export const delTrack = createAsyncThunk(
    'music/delete',
    async (tracId, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await trackService.deleteTrack(tracId,token)
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



export const updateTrack = createAsyncThunk(
    'music/put',
    async (trackData, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await trackService.updateTrack(trackData,token)
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

export const changeLike = createAsyncThunk(
    'music/onLike',
    async (trackData, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await trackService.changeLike(trackData,token)
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

export const addView = createAsyncThunk(
    'music/addView',
    async (id, thunkAPI)=>{
        try{
            return await trackService.addView(id)
        }catch (e) {
            const mes =
                (e.response && e.response.data && e.response.data.message) ||
                e.message ||
                e.toString()
            return thunkAPI.rejectWithValue(mes)
        }
    }
)

export const getTrack = createAsyncThunk(
    'music/getTrack',
    async (id, thunkAPI)=>{
        try{
            return await trackService.getTrack(id)
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


export const addComment = createAsyncThunk(
    'music/addComment',
    async (commData, thunkAPI)=>{
        try{
            const token = await authService.checkRefresh();
            return await trackService.addComments(commData,token)
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

export const trackSlice = createSlice({
    name:'audio',
    initialState,
    reducers:{resetTrack:(state)=> {
                state.tracks= []
                state.comments = []
                state.isError=  false
                state.isSuccess=  false
                state.isLoading=  false
                state.message=  ''
        }},
    extraReducers:builder =>{
        builder
            .addCase(addTrack.pending,(state)=>{
                state.isLoading = true;
        })
            .addCase(addTrack.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.tracks.push(action.payload)
        })
            .addCase(addTrack.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
            .addCase(getTracks.pending,(state)=>{
            state.isLoading = true;
            state.isSuccess = false;
        })
            .addCase(getTracks.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.tracks = action.payload
        })
            .addCase(getTracks.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
            .addCase(delTrack.pending,(state)=>{
            state.isLoading = true;
        })
            .addCase(delTrack.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.tracks = state.tracks.filter((track)=> track._id !== action.payload.id)
        })
            .addCase(delTrack.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })

            .addCase(updateTrack.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.tracks.splice(state.tracks.findIndex(obj=>obj._id===action.payload._id),1,action.payload)
        })
            .addCase(updateTrack.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
            .addCase(changeLike.fulfilled, (state,action)=>{
                state.tracks.splice(state.tracks.findIndex(obj=>obj._id===action.payload._id),1,action.payload)
            })
            .addCase(addView.fulfilled, (state,action)=>{
                state.viewAdded = true
                state.tracks.splice(state.tracks.findIndex(obj=>obj._id===action.payload._id),1,action.payload)
            })
            .addCase(addView.pending, (state,action)=>{
                state.viewAdded = false
            })
            .addCase(getTrack.fulfilled, (state,action)=>{
                state.track = action.payload
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(getTrack.pending,(state)=>{
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(addComment.fulfilled,(state,action)=>{
                state.track = action.payload
                state.isSuccess = true
                state.isLoading = false;
            })
            .addCase(addComment.pending,(state,action)=>{
                state.isLoading = true;
                state.isSuccess = false;
            })
    }
})

export const {resetTrack} = trackSlice.actions
export default trackSlice.reducer