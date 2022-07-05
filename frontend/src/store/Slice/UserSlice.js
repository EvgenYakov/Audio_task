import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import userService from "../actions/userService"

const initialState = {
    users: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const getUsers = createAsyncThunk(
    'user/get',
    async (_,thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await userService.getUsers(token)
        }catch(e) {
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

export const updateUser = createAsyncThunk(
    'user/put',
    async (userData,thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await userService.updateUser(userData,token)
        }catch(e){
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


export const addUser = createAsyncThunk(
    'user/post',
    async (userData,thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await userService.addUser(userData,token)
        }catch(e){
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

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (userId,thunkAPI)=>{
        try{
            const token = thunkAPI.getState().auth.user.token;
            return await userService.deleteUser(userId,token)
        }catch(e){
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


export const UserSlice = createSlice(
    {
        name:'user',
        initialState,
        reducers:{
            resetUser(state){
                return initialState
            },
            deleteAdminUser(state,action){
                console.log(action.payload)
                state.users = state.users.filter(track=>track._id===action.payload)
            }
        },
        extraReducers:builder => {
            builder
                .addCase(getUsers.pending,(state)=>{
                    state.isLoading = true;
                })
                .addCase(getUsers.fulfilled, (state, action)=>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.users = action.payload
                })
                .addCase(getUsers.rejected,(state,action)=>{
                    state.isLoading = false
                    state.isError = true
                    state.message = action.payload
                })
                .addCase(updateUser.pending,(state)=>{
                    state.isLoading = true;
                })
                .addCase(updateUser.fulfilled, (state, action)=>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.users.splice(state.users.findIndex(obj=>obj._id===action.payload._id),1,action.payload)
                })
                .addCase(updateUser.rejected,(state,action)=>{
                    state.isLoading = false
                    state.isError = true
                    state.message = action.payload
                })
                .addCase(addUser.pending,(state)=>{
                    state.isLoading = true;
                })
                .addCase(addUser.fulfilled, (state, action)=>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.users.push(action.payload)
                })
                .addCase(addUser.rejected,(state,action)=>{
                    state.isLoading = false
                    state.isError = true
                    state.message = action.payload
                })
                .addCase(deleteUser.pending,(state)=>{
                    state.isLoading = true;
                })
                .addCase(deleteUser.fulfilled, (state, action)=>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.users = state.users.filter((track)=> track._id !== action.payload.id)
                })
                .addCase(deleteUser.rejected,(state,action)=>{
                    state.isLoading = false
                    state.isError = true
                    state.message = action.payload
                })
        }
    }
)


export const {resetUser,deleteAdminUser} = UserSlice.actions
export default UserSlice.reducer