import './AllMusic.css'
import TrackList from "../../component/tracklist/TrackList";
import {useEffect, useState} from "react"
import Playlist from "./Playlist/playList";
import Modal from "../../component/modal/modal";
import ModalAdd from "./modalForms/add/modalAdd";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {logout} from "../../store/Slice/AuthSlice";
import {delTrack, getTracks, updateTrack,resetTrack} from "../../store/Slice/trackSlice";
import {useNavigate} from "react-router-dom";
import Spinner from "../../component/Spinner/Spinner";
import PlayerFooter from "../../component/playerFoot/player";
import {getPlaylist, resetPLaylist} from "../../store/Slice/PlaylistSlice";

const initialPlaylists = [
    {
        id:"1",
        label:"Нервы",
        url:"https://avatars.yandex.net/get-music-user-playlist/34120/562185299.1056.41204/m1000x1000?1574090208908&webp=false",
        tracks:["2"]
    },
    {
        id:"2",
        url:"https://yt3.ggpht.com/a/AATXAJzCgu7Cacj8ARYjvR1wN9mdTqBNO0nwlUswk8CsIA=s900-c-k-c0xffffffff-no-rj-mo",
        label:"мои",
        tracks: ["1","3"]
    }
    ]




 function AllMusic(){
     const dispatch = useDispatch()
     const navigate = useNavigate();
     const [actTracks, setActiveTracks] = useState([])
     const [activeTrack, setActiveTrack] = useState({})
    // const [playlists, setPlaylists] = useState(initialPlaylists)
     const [modalActive,setModalActive]=useState(false)
     const [searchVal, setSearchVal] = useState("");

     const {tracks, isLoading, isError, isSuccess, message } = useSelector(
         (state) => {
             return state.track
         }
     )
     const {playlists} = useSelector(
         (state) => {
             return state.playlist
         }
     )

     const {user} = useSelector(
         (state) => {
             return state.auth
         }
     )


     useEffect(() => {
         if (isError) {
             console.log(message)
             if (message===401) {
                 toast.error("Время сеанса истекло")
                 dispatch(logout())
                 navigate('/auth')
                // dispatch(resetTrack())
                 return
             }
             toast.error(message)
         }
         if (!user) {
             navigate('/auth')
         }
         dispatch(getTracks())
         dispatch(getPlaylist())

         return () => {
             dispatch(resetTrack())
             dispatch(resetPLaylist())
         }
     }, [user, navigate, isError, message, dispatch])

     useEffect(() => {
         setActiveTracks([...tracks])
         setActiveTrack(0)
     }, [isSuccess])

    const onSortCount = ()=>{
        const sortTracks = actTracks.slice(0);
        sortTracks.sort((a,b)=> b.numOfAud - a.numOfAud)
        console.log(sortTracks)
        setActiveTracks(sortTracks)
    }

    const onSortLiked = ()=>{
        const sortTracks = actTracks.slice(0);
        sortTracks.sort((a,b)=> b.numOfLks - a.numOfLks)
        setActiveTracks(sortTracks)
    }

     const onAll = ()=>{
         setActiveTracks(tracks)
     }

    const onSubSearch = (e)=>{
        e.preventDefault();
        const searchList = [...tracks].filter((track)=> track.label.match(new RegExp(`${searchVal}`,'gi')));
        console.log(searchList)
        if (searchList.length === 0){
            return 0;
        }
        setActiveTracks(searchList);
        setActiveTrack(0);
    }


    const playTrack= (id)=>{
        const activeTracks = [...actTracks];
        const indexActiveTrack = activeTracks.findIndex((track)=>track._id===id)
        const track = {...activeTracks[indexActiveTrack]}
        track.numOfAud++;
        dispatch(updateTrack(track))
        setActiveTrack(indexActiveTrack)
     }
     const changeActiveTrack=(index)=>{
         setActiveTrack(index)
     }

     const onPlaylist = (tracksId)=>{
         const active = tracks.filter(track => tracksId.includes(track._id));
         setActiveTracks(active)
         setActiveTrack(0);
     }

    return (
        <div className="AllMusic">
            <div className="mBody">
               <h1>
                   Список треков
               </h1>
                    <Playlist playlists={playlists} setModalActive={setModalActive} onPlaylist={onPlaylist}/>
                {/*Сделать компонент */}
                <div className="listControls">
                    <div className="btn-group m-1">
                        <button className="btn btn-dark m-0"  onClick={()=>onAll()}>Все</button>
                        <button className="btn btn-dark m-0"  onClick={()=>onSortCount()} >Самые прослушиваемые</button>
                        <button className="btn btn-dark m-0"  onClick={()=>onSortLiked()}>Популярные</button>
                    </div>
                    <form className="d-flex m-1" onSubmit={(e)=>onSubSearch(e)}>
                        <input className="form-control me-2 opacity-75" type="search" placeholder="Поиск трека" value={searchVal} onChange={(e)=>{setSearchVal(e.target.value)}} aria-label="Search"/>
                        <button className="btn btn-outline-light m-0" type="submit">Search</button>
                    </form>
                </div>

                <hr/>
                { isLoading  ?  <Spinner/>:
                    (actTracks.length === 0 ? <p>Пусто</p> :
                     <TrackList tracks={actTracks} playTrack={playTrack} activeTrack={activeTrack}/>)}

            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                    <ModalAdd setActive={setModalActive} active={modalActive}/>
            </Modal>
            {actTracks.length === 0 ? <></> :
                <PlayerFooter tracks={actTracks} activeTrack={activeTrack} changeTrack={changeActiveTrack}/> }
        </div>
    )
}

export default AllMusic