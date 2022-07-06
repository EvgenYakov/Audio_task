import './AllMusic.css'
import TrackList from "../../component/tracklist/TrackList";
import {useEffect, useRef, useState} from "react"
import Playlist from "./Playlist/playList";
import Modal from "../../component/modal/modal";
import ModalAdd from "./modalForms/add/modalAdd";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {logout, putUser} from "../../store/Slice/AuthSlice";
import {getTracks, updateTrack,resetTrack} from "../../store/Slice/trackSlice";
import {useNavigate} from "react-router-dom";
import Spinner from "../../component/Spinner/Spinner";
import PlayerFooter from "../../component/playerFoot/player";
import {getPlaylist, resetPLaylist} from "../../store/Slice/PlaylistSlice";
import ModalEdit from "./modalForms/editForm/modalEdit";
import ListControl from "../../component/ListControl/ListControl";


 function AllMusic(){
     const dispatch = useDispatch()
     const navigate = useNavigate();
     const [actTracks, setActiveTracks] = useState([])
     const [activeTrack, setActiveTrack] = useState({})
     const [modalActive,setModalActive]=useState(false)
     const modalEdit = useRef(null);

     const openAddModal = ()=>{
         modalEdit.current = null;
        setModalActive(true)
     }

     const openEditModal = (plst)=>{
         modalEdit.current = plst;
         setModalActive(true)
     }

     const {tracks, isLoading, isError, isSuccess, message } = useSelector(
         (state) => {
             return state.track
         }
     )
     const {playlists,plstMessage,isPlstSucces,isPlstError,isPlstLoading} = useSelector(
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
             if (message===401||plstMessage===401) {
                 toast.error("Время сеанса истекло")
                 dispatch(resetTrack())
                 dispatch(logout())
                 navigate('/auth')
                 return
             }
             toast.error(message)
         }
         if (isPlstError) {
             if (plstMessage===401) {
                 toast.error("Время сеанса истекло")
                 dispatch(resetTrack())
                 dispatch(logout())
                 navigate('/auth')
                 return
             }
             toast.error(plstMessage)
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
     }, [navigate, isError, message, dispatch,plstMessage,isPlstError])


     useEffect(() => {
         setActiveTracks([...tracks])
         setActiveTrack(0)
     }, [isSuccess])


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
     const onLiked = ()=>{
         const trks = tracks.filter(track=>user.liked.find(id=>track._id===id))

         setActiveTracks(trks)
         setActiveTrack(0);
     }

     const onLike = (track)=>{
         const newTrack = {...track}
         const newLiked = [...user.liked]
         const newUser = {...user}
         newTrack.numOfLks++;
         newLiked.push(track._id)
         newUser.liked = newLiked;
         dispatch(putUser(newUser))
         dispatch(updateTrack(newTrack))
     }
     const onDisLike = (track)=>{
         const newTrack = {...track}
         const newLiked = [...user.liked].filter(id=>id!==track._id)
         const newUser = {...user}
         newTrack.numOfLks--;
         newUser.liked = newLiked;
         dispatch(putUser(newUser))
         dispatch(updateTrack(newTrack))
     }

     const onAud = (trIn) => {
         const track = {...tracks[trIn]}
         track.numOfAud++;
         dispatch(updateTrack(track))
     }

    return (
        <div className="AllMusic">
            <div className="mBody">
               <h1>
                   Музыка
               </h1>
                <Playlist playlists={playlists} openAddModal={openAddModal} openEditModal={openEditModal} onLiked={onLiked} onPlaylist={onPlaylist}/>
                <ListControl actTracks={actTracks} setActiveTracks={setActiveTracks} setActiveTrack={setActiveTrack}/>
                <hr/>
                { isLoading  ?  <Spinner/>:
                    (actTracks.length === 0 ? <p>Пусто</p> :
                     <TrackList tracks={actTracks} playTrack={playTrack} onLike={onLike} onDisLike={onDisLike} activeTrack={activeTrack}/>)
                }

            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                {modalEdit.current ?
                    <ModalEdit setActive={setModalActive} active={modalActive} playList={modalEdit.current}/>:
                    <ModalAdd setActive={setModalActive} active={modalActive}/>
                }
            </Modal>

            {actTracks.length === 0 ?
                <></> :
                <PlayerFooter tracks={actTracks} activeTrack={activeTrack} onAud={onAud} changeTrack={changeActiveTrack}/>
            }
        </div>
    )
}

export default AllMusic