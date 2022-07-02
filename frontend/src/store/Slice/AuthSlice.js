import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../actions/authServise'


// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))
console.log(user)

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI)=>{
    try{
        return await authService.register(user)
    } catch (e){
        const mes =
            (e.response && e.response.data && e.response.data.message) ||
            e.message ||
            e.toString()
        return thunkAPI.rejectWithValue(mes)
    }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI)=>{
        try{
            return await authService.loginUser(user)
        } catch (e){
            const mes =
                (e.response && e.response.data && e.response.data.message) ||
                e.message ||
                e.toString()
            return thunkAPI.rejectWithValue(mes)
        }
    }
)

export const updateUser = createAsyncThunk('auth/put', async (userData, thunkAPI)=>{
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await authService.updateUser(userData,token)
    } catch (e){
        const mes =
            (e.response && e.response.data && e.response.data.message) ||
            e.message ||
            e.toString()
        return thunkAPI.rejectWithValue(mes)
    }
} )

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder)=>{
        builder
            .addCase(register.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state,action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })

            .addCase(login.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state,action)=>{
                console.log( action)
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state,action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })

            .addCase(logout.fulfilled, (state) => {
            state.user = null
        })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer