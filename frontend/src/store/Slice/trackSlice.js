import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import trackService from "../actions/trackService";


// Get user from localStorage
const initialState = {
    tracks: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const addTrack = createAsyncThunk(
    'music/add',
    async (trackData, thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await trackService.addTrack(trackData,token)
        }catch (e) {
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
            const token = thunkAPI.getState().auth.user.token;
            return await trackService.getTracks(token)
        }catch (e) {
            console.log(e)
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
            const token = thunkAPI.getState().auth.user.token;
            return await trackService.deleteTrack(tracId,token)
        }catch (e) {
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
            const token = thunkAPI.getState().auth.user.token;
            return await trackService.updateTrack(trackData,token)
        }catch (e) {
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
    }
})

export const {resetTrack} = trackSlice.actions
export default trackSlice.reducer