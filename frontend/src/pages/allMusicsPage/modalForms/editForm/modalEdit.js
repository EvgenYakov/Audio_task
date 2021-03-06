
import Cinput from "../../../../UI/CInput/Cinput";
import Cbutton from "../../../../UI/CButton/cbutton";
import './modalEdit.css'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import TrackList from "../../../../component/tracklist/TrackList";
import {useEffect, useState} from "react";
import {addPlaylist, deletePlaylist, putPlaylist} from "../../../../store/Slice/PlaylistSlice";


export default function ModalEdit(props){

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {tracks, isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.track
        }
    )
    const [formData, setFormData] = useState({
        url:props.playList.url,
        label:props.playList.label,
        playlist:props.playList.tracks
    })
    const {label, url,playlist} = formData
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    useEffect(()=>{
        setFormData({
            url:props.playList.url,
            label:props.playList.label,
            playlist:props.playList.tracks
        })
    },[props.active])

    const pushInPlayList=(id)=>{
        const newPlaylist = [...playlist]
        newPlaylist.push(id)
        setFormData(prevState => ({
            ...prevState,
            playlist:newPlaylist
        }))
    }

    const delFromPlaylist = (id)=>{
        const newPlaylist = [...playlist].filter(trackId=>trackId!==id)
        setFormData(prevState => ({
            ...prevState,
            playlist:newPlaylist
        }))
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const updateSubPlaylist = (e)=>{
        e.preventDefault()
        const formData ={
            _id:props.playList._id,
            label,
            url,
            tracks:playlist
        }
        dispatch(putPlaylist(formData))
        props.setActive(false)
    }

    const daleteSubPlaylist = (e)=>{
        e.preventDefault()
        dispatch(deletePlaylist(props.playList._id))
        props.setActive(false)
    }


    return(
        <>
            <form className="addPlst" onSubmit={e=>updateSubPlaylist(e)}>
                <Cinput
                    id="floatingText"
                    place = "Track"
                    label="?????????????? ????????????????  ??????????????????"
                    name="label"
                    value={label}
                    onChange ={onChange}
                >
                </Cinput>
                <Cinput
                    id="floatingText"
                    place = "Track"
                    label="?????????????? URL ????????????????"
                    name="url"
                    value={url}
                    onChange ={onChange}
                >
                </Cinput>
                <button type="submit"  className = "btn btn-success btn-lg">
                    ????????????????
                </button>
                <button type="button" className = "btn btn-danger btn-lg" onClick={daleteSubPlaylist}>
                    ??????????????
                </button>
            </form>
            <TrackList forModal={true} tracks={tracks} pushInPlaylist={pushInPlayList} delFromPlaylist={delFromPlaylist} playlist={playlist}/>
        </>

    )
}