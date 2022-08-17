import Cinput from "../../../../UI/CInput/Cinput";
import Cbutton from "../../../../UI/CButton/cbutton";
import './modalAdd.scss'
import {useDispatch, useSelector} from "react-redux";
import TrackList from "../../../../component/tracklist/TrackList";
import {useEffect, useState} from "react";
import {addPlaylist} from "../../../../store/Slice/PlaylistSlice";


export default function ModalAdd(props){
    const dispatch = useDispatch()
    const [playlist,setPlaylist] = useState([])
    const {tracks} = useSelector(
        (state) => {
            return state.track
        }
    )
    const [formData, setFormData] = useState({
        label: '',
        url: ''
    })
    const {label, url} = formData
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    useEffect(()=>{
        setFormData({
            label: '',
            url: ''
        })
        setPlaylist([])
    },[props.active])

    const pushInPlayList=(id)=>{
        const newPlaylist = [...playlist]
        newPlaylist.push(id)
        setPlaylist(newPlaylist)
    }

    const delFromPlaylist = (id)=>{
        const newPlaylist = [...playlist].filter(trackId=>trackId!==id)
        setPlaylist(newPlaylist)
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const addSubPlaylist = (e)=>{
        e.preventDefault()
        const formData ={
            label,
            url,
            playlist
        }
        dispatch(addPlaylist(formData))
        props.setActive(false)
    }

    return(
        <>
            <form className="addPlst" onSubmit={e=>addSubPlaylist(e)}>
                <Cinput
                    id="floatingText"
                    place = "Track"
                    label="Введите название  плейлиста"
                    name="label"
                    value={label}
                    onChange ={onChange}
                >
                </Cinput>
                <Cinput
                    id="floatingText"
                    place = "Track"
                    label="Введите URL картинки"
                    name="url"
                    value={url}
                    onChange ={onChange}
                >
                </Cinput>
                <Cbutton  style = "btn-primary btn-lg">
                    Добавить
                </Cbutton>

            </form>
            <TrackList forModal={true} tracks={tracks} pushInPlaylist={pushInPlayList} delFromPlaylist={delFromPlaylist} playlist={playlist}/>
        </>

    )
}