import "./home.scss"
import {useEffect,useState} from "react";
import Spinner from "../../component/Spinner/Spinner";
import TrackList from "../../component/tracklist/TrackList";
import PlayerFooter from "../../component/playerFoot/player";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {addView, getTracks, resetTrack} from "../../store/Slice/trackSlice";
import {logout, reset} from "../../store/Slice/AuthSlice";
import {resetPLaylist} from "../../store/Slice/PlaylistSlice";

export default function Home(){
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [actTracks, setActiveTracks] = useState([])
    const [activeTrack, setActiveTrack] = useState(0)

    const {tracks, isLoading, isError, isSuccess, message,viewAdded} = useSelector(
        (state) => {
            return state.track
        }
    )

    useEffect(() => {
        if (isError) {
            if (message===401) {
                toast.error("Время сеанса истекло")
                dispatch(resetTrack())
                dispatch(reset())
                dispatch(resetPLaylist())
                dispatch(logout())
                return
            } else
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
            setActiveTrack({
                index:0,
                fileId:tracks[0].fileId
            })
        }
    }, [isSuccess])

    useEffect(()=>{
        if(activeTrack && tracks.length){
            const track = tracks.find(track=>track.fileId===activeTrack.fileId)
            dispatch(addView(track._id))
        }
    },[activeTrack])

    useEffect(()=>{
        if(viewAdded){
            const chTracks = JSON.parse(JSON.stringify(tracks)).filter(track=>actTracks.find(tr=>tr._id===track._id))
            setActiveTracks(chTracks)
        }
    },[viewAdded])

    const playTrack= (fileId,index)=>{
        setActiveTrack({
            index,
            fileId
        })
    }

    const changeActiveTrack=(id)=>{
        const track = tracks.find(track=>track._id===id)
        setActiveTrack({
            index:0,
            fileId:track.fileId
        })
    }

    function toPrevTrack (){
        const activeTracks = [...actTracks]
        const actTrack = {...activeTrack}
        console.log()
        if (actTrack.index - 1 < 0){
            actTrack.index =activeTracks.length-1;
            actTrack.fileId = activeTracks[actTrack.index].fileId;
        }else {
            actTrack.index--;
            actTrack.fileId = activeTracks[actTrack.index].fileId;
        }
        setActiveTrack(actTrack)
    }

    function toNextTrack(){
        const activeTracks = [...actTracks]
        const actTrack = {...activeTrack}
        if (actTrack.index < tracks.length - 1 ){
            ++actTrack.index;
            actTrack.fileId = activeTracks[actTrack.index].fileId;
        } else {
            actTrack.index=0;
            actTrack.fileId = activeTracks[actTrack.index].fileId;
        }
        setActiveTrack(actTrack)
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
                <PlayerFooter activeTrack={activeTrack} changeTrack={changeActiveTrack}
                              toPrevTrack={toPrevTrack} toNextTrack={toNextTrack}/>
            }
        </div>
    )
}