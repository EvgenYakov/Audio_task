import axios from "axios";

const API_URL = '/auth/'


async function register(userData){
    return  await fetch(API_URL + "register", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(res=> res.json()).then(data =>{
        if (data.data) {
            localStorage.setItem('user', JSON.stringify(data.data))
            return data.data;
        }
        return Promise.reject(data)
    })
}

async function loginUser(userData){
    return await fetch(API_URL + "login", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(res=> res.json()).then(data =>{
        if (data.data) {
            localStorage.setItem('user', JSON.stringify(data.data))
            return data.data;
        }
        return Promise.reject(data)
    })
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