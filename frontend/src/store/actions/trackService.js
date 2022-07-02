import axios from "axios";

export async function addTrack(trackData,token){
    const uploadRes =  await axios.post('/music/upload', trackData.data, {
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const resp =  await axios.post('/music/', {
        id:uploadRes.data.trackId,
        label:trackData.label,
        author:trackData.author,
        url:trackData.url
    }, config)
    console.log(resp.data)
    return resp.data;
}

export async function getTracks(token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get('/music/',config)
    console.log(response)
    return response.data
}


export async function deleteTrack(trackId,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete('/music/'+trackId,config)
    return response.data
}

export async function updateTrack(trackData,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    console.log(trackData)
    const response = await axios.put('/music/'+trackData._id,trackData,config)
    return response.data
}


const trackService = {
    addTrack,
    getTracks,
    deleteTrack,
    updateTrack
}

export default trackService
