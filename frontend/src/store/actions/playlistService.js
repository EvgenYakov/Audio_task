import axios from "axios";
import {toast} from "react-toastify";
import {Schema} from "mongoose";
import {addTrack, deleteTrack, getTracks, updateTrack} from "./trackService";


export async function addPlaylist(trackData,token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const resp =  await axios.post('/playlist/', {
        label:trackData.label,
        url:trackData.url,
        tracks:trackData.playlist
    }, config)
    return resp.data;
}

export async function getPlaylist(token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    const resp =  await axios.get('/playlist/', config)
    return resp.data;
}


const playlistService = {
    addPlaylist,
    getPlaylist
}

export default playlistService