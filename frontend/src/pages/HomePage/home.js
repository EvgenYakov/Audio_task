import "./home.css"
import {useEffect,useState} from "react";
import Spinner from "../../component/Spinner/Spinner";
import TrackList from "../../component/tracklist/TrackList";
import PlayerFooter from "../../component/playerFoot/player";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {addView, getTracks, resetTrack} from "../../store/Slice/trackSlice";
import {logout} from "../../store/Slice/AuthSlice";
import {resetPLaylist} from "../../store/Slice/PlaylistSlice";


export default function Home(){
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [actTracks, setActiveTracks] = useState([])
    const [activeTrack, setActiveTrack] = useState(0)

    const changeActiveTrack=(id)=>{
        if (id !== activeTrack)
            setActiveTrack(id)
    }

    const {tracks, isLoading, isError, isSuccess, message,viewAdded} = useSelector(
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
        if (isError) {
            if (message===401) {
                toast.error("Время сеанса истекло")
                dispatch(resetTrack())
                dispatch(resetPLaylist())
                dispatch(logout())
                navigate('/auth')
                return
            }
            toast.error(message)
        }

        dispatch(getTracks())

        return () => {
            dispatch(resetTrack())
        }
    }, [navigate, isError, message, dispatch])


    useEffect(() => {
        if (tracks.length){
            setActiveTracks(JSON.parse(JSON.stringify(tracks)));
            setActiveTrack(tracks[0]._id)
        }

    }, [isSuccess])

    useEffect(()=>{
        if(activeTrack && tracks.length){
            dispatch(addView(activeTrack))
        }
    },[activeTrack])

    useEffect(()=>{
        if(viewAdded){
            const chTracks = JSON.parse(JSON.stringify(tracks)).filter(track=>actTracks.find(tr=>tr._id===track._id))
            setActiveTracks(chTracks)
        }
    },[viewAdded])

    const playTrack= (id)=>{
        setActiveTrack(id)
    }

    const onAud = (id) => {
        //actTracks[activeTrack].numOfAud++;
        dispatch(addView(id))
    }

    return (
        <div className="Home">
            <div className="mBody">
                <h1>
                    Главная страница
                </h1>
                <h2>
                   Зарегистрируйся и получи больше
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