import axios from "axios";

async function updateUser(userData,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.put('/user/'+userData._id,userData,config)
    return response.data
}

async function getUsers(token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get('/user/',config)
    return response.data
}


async function addUser(userData,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post('/user/',userData,config)
    return response.data
}

async function deleteUser(userId,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete('/user/'+userId,config)
    return response.data
}


const userService = {
    updateUser,
    getUsers,
    addUser,
    deleteUser
}

export default userService