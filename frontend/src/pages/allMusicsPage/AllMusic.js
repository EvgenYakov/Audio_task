import './AllMusic.scss'
import TrackList from "../../component/tracklist/TrackList";
import {useEffect, useRef, useState} from "react"
import Playlist from "./Playlist/playList";
import Modal from "../../component/modal/modal";
import ModalAdd from "./modalForms/add/modalAdd";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {logout, putUser, reset} from "../../store/Slice/AuthSlice";
import {resetTrack,  addView, changeLike} from "../../store/Slice/trackSlice";
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

     const {tracks, isLoading, isError, isSuccess, message,viewAdded} = useSelector(
         (state) => {
             return state.track
         }
     )
     const {playlists,plstMessage,isPlstError,isPlstLoading} = useSelector(
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
         if (isError || isPlstError) {
             if (message===401||plstMessage===401) {
                 toast.error("Время сеанса истекло")
                 dispatch(resetTrack())
                 dispatch(resetPLaylist())
                 dispatch(reset())
                 dispatch(logout())
                 navigate('/auth')
                 return
             }
             toast.error(message)
         }
         if (!user) {
             navigate('/auth')
             return
         }
         dispatch(getPlaylist())

         return () => {
             dispatch(resetTrack())
             dispatch(resetPLaylist())
         }
     }, [navigate, isError, message, dispatch,plstMessage,isPlstError])

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
         if(Object.keys(activeTrack).length && tracks.length){
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

     const onPlaylist = (tracksId)=>{
         const active = tracks.filter(track => tracksId.includes(track._id));
         setActiveTracks(active)
         if(active[0].fileId !== activeTrack.fileId  || activeTrack.index!==0)
             setActiveTrack({
                 index:0,
                 fileId:active[0].fileId}
             );
     }

     const onLiked = ()=>{
         const trks = tracks.filter(track=>user.liked.find(id=>track._id===id))
         setActiveTracks(trks)
         if(trks[0].fileId !== activeTrack.fileId || activeTrack.index!==0)
           setActiveTrack({
               index:0,
               fileId:trks[0].fileId});
     }

     const onLike = (_id)=>{
         const newLiked = [...user.liked]
         const newUser = {...user}
         const trackData = {
             id:_id,
             like:true
         }
         newLiked.push(_id)
         newUser.liked = newLiked;
         dispatch(putUser(newUser))
         dispatch(changeLike(trackData))
     }
     const onDisLike = (_id)=>{
         const newLiked = [...user.liked].filter(id=>id!==_id)
         const newUser = {...user};
         const trackData = {
             id:_id,
             like:false
         }
         newUser.liked = newLiked;
         dispatch(putUser(newUser))
         dispatch(changeLike(trackData))
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
        <div
            className="AllMusic"
        >
            <div className="mBody">
               <h1>
                   Музыка
               </h1>
                <Playlist playlists={playlists} openAddModal={openAddModal} openEditModal={openEditModal} onLiked={onLiked} onPlaylist={onPlaylist}/>
                <ListControl actTracks={actTracks} setActiveTracks={setActiveTracks} setActiveTrack={setActiveTrack}/>
                <hr/>
                { isLoading || isPlstLoading  ?  <Spinner/>:
                    (actTracks.length === 0 && activeTrack ? <p>Пусто</p> :
                     <TrackList tracks={actTracks} playTrack={playTrack} onLike={onLike} onDisLike={onDisLike} activeTrack={activeTrack}/>)
                }

            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                {modalEdit.current ?
                    <ModalEdit setActive={setModalActive} active={modalActive} playList={modalEdit.current}/>:
                    <ModalAdd setActive={setModalActive} active={modalActive}/>
                }
            </Modal>

            {actTracks.length === 0 || !activeTrack ?
                <></> :
                <PlayerFooter activeTrack={activeTrack} changeTrack={changeActiveTrack}
                              toPrevTrack={toPrevTrack} toNextTrack={toNextTrack}/>
            }
        </div>
    )
}

export default AllMusic