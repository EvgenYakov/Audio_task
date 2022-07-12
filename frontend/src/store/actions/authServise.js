import axios from "axios";

const API_URL = '/auth/'


async function register(userData){
   const config = {
        headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
        },
    }
    const resp =  await axios.post('/auth/'+"register", userData, config)
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
    const resp =  await axios.post('/auth/'+"login", userData, config)
    if (resp.data) {
        localStorage.setItem('user', JSON.stringify(resp.data))
    }

    return resp.data;
}
//.then(res => res.ok ? res : Promise.reject(res))
async function logout(){
    localStorage.removeItem('user')
}



const authService = {
    register,
    loginUser,
    logout
}

export default authService