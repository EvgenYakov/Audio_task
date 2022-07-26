import axios from "axios";

export async function addTrack(trackData,token){
    const uploadRes =  await axios.post('/stream/upload', trackData.data, {
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

export async function service(trackData,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    console.log(trackData)
    const response = await axios.post('/music/like/'+trackData.id,trackData,config)
    return response.data
}


export async function getComments(id){
    const response = await axios.get('/music/comments/'+id)
    return response.data
}

export async function addComments(commData,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post('/music/comments/'+commData.id,commData.data,config)
    return response.data
}


export async function addView(id){
    const response = await axios.post('/music/view/'+id)
    return response.data
}

const trackService = {
    addTrack,
    getTracks,
    deleteTrack,
    updateTrack,
    service,
    getComments,
    addComments,
    addView
}

export default trackService
