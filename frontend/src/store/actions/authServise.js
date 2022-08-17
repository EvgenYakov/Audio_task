import axios from "axios";


async function register(userData){
   const config = {
        headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
        },
    }
    const resp =  await axios.post('/auth/register', userData, config)
    if (resp.data) {
        localStorage.setItem('user', JSON.stringify(resp.data))
    }

    return resp.data;
}

async function loginUser(userData){
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    }
    const resp =  await axios.post('/auth/login', userData, config)
    if (resp.data) {
        localStorage.setItem('user', JSON.stringify(resp.data))
    }

    return resp.data;
}


async function checkRefresh(){
    const token = JSON.parse(localStorage.getItem('user'))? JSON.parse(localStorage.getItem('user')).token:null;
    if (token){
        const isTokenExpired =  Date.now() >= (JSON.parse(atob(token.split('.')[1]))).exp * 1000-5000
        if (isTokenExpired){
            const resp = await axios.post('/auth/refresh',{withCredentials: true});
            await localStorage.setItem('user', JSON.stringify(resp.data))
            return resp.data.token
        }
    }
    return token
}

async function logout(){
    const resp =  await axios.post('/auth/logout', {withCredentials: true})
    localStorage.removeItem('user')
    return resp.data;
}

const authService = {
    register,
    loginUser,
    checkRefresh,
    logout
}

export default authService