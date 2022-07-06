import "./home.css"
import {useEffect,useState,useRef} from "react";
import Spinner from "../../component/Spinner/Spinner";
import TrackList from "../../component/tracklist/TrackList";
import PlayerFooter from "../../component/playerFoot/player";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {getTracks, resetTrack, updateTrack} from "../../store/Slice/trackSlice";
import {logout} from "../../store/Slice/AuthSlice";
import {getPlaylist, resetPLaylist} from "../../store/Slice/PlaylistSlice";


export default function Home(){
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [actTracks, setActiveTracks] = useState([])
    const [activeTrack, setActiveTrack] = useState({})

    const changeActiveTrack=(index)=>{
        setActiveTrack(index)
    }

    const {tracks, isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.track
        }
    )

    useEffect(() => {
        if (isError) {
            toast.error(message)
            return
        }
        dispatch(getTracks())
    }, [])

    useEffect(() => {
        setActiveTracks([...tracks].slice(0,10))
        setActiveTrack(0)
    }, [isSuccess])

    const playTrack= (id)=>{
        const activeTracks = [...actTracks];
        const indexActiveTrack = activeTracks.findIndex((track)=>track._id===id)
        setActiveTrack(indexActiveTrack)
    }

    const onAud = (trIn) => {
        const track = {...tracks[trIn]}
        track.numOfAud++;
        dispatch(updateTrack(track))
    }

    return (
        <div className="Home">
            <div className="mBody">
                <h1>
                    Главная страница
                </h1>
                <h2>
                    Зарегестрируйся и получи больше
                </h2>
                <hr/>
                { isLoading  ?  <Spinner/>:
                    (actTracks.length === 0 ? <p>Пусто</p> :
                        <TrackList tracks={actTracks} playTrack={playTrack} activeTrack={activeTrack}/>)
                }
            </div>

            {actTracks.length === 0 ?
                <></> :
                <PlayerFooter tracks={actTracks} activeTrack={activeTrack} onAud={onAud} changeTrack={changeActiveTrack}/>
            }
        </div>
    )
}