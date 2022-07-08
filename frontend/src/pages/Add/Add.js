import './Add.css'
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addTrack, delTrack, getTracks, resetTrack, updateTrack} from "../../store/Slice/trackSlice";
import Spinner from "../../component/Spinner/Spinner";
import {toast} from "react-toastify";
import AddForm from "./addForm/addForm";
import TrackList from "../../component/tracklist/TrackList";
import UpdateForm from "./updateForm/updateForm";
import {logout} from "../../store/Slice/AuthSlice";

export default function Add(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formControl, setFormControl] = useState({addForm:true, formValue:null})
    const {tracks,isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.track
        }
    )
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    useEffect(() => {
        if (isError) {
           toast.error(message)
            if (message===401) {
                dispatch(logout())
                navigate('/')
            }
        }
        if (!user) {
            navigate('/auth')
            return
        }
        if (user.role !=='admin') {
            navigate('/')
        }

        dispatch(getTracks())
        return () => {
            dispatch(resetTrack)
        }
    }, [user, navigate, isError, message,dispatch])




    const addTrackSub = async (e,infoOfTrack,selectAudio)=> {
        e.preventDefault()
        if (!infoOfTrack.label || !infoOfTrack.author) {
            toast.error("Автор или название не введено")
            return
        }
        if (!selectAudio){
            toast.error("Выберите аудиозапись")
            return
        }
        const data = new FormData();
        data.append('file',selectAudio)
        const trackData = {
            ...infoOfTrack,
            data
        }
        await dispatch(addTrack(trackData))
    }

    const updateTrackSub = async (e,infoOfTrack)=> {
        e.preventDefault()
        const trackData = {
            ...infoOfTrack
        }
        if (!infoOfTrack.label || !infoOfTrack.author) {
            toast.error("Автор или название не введено")
            return
        }
        await dispatch(updateTrack(trackData))
        openAddForm();
    }


    const openEditForm =(track)=>{
        window.scrollTo(0, 0);
        setFormControl({
            addForm: false,
            formValue: {...track}
        })
    }

    const openAddForm =()=>{
        setFormControl({addForm: true , formValue: null})
    }

    const deleteTrack = async (id)=>{
        dispatch(delTrack(id))
    }

    return (
        <div className="add">
            <div className="mBodyAdd">
            {
                isLoading ?
                    <Spinner />
                    :<>{
                        formControl.addForm ?
                            <AddForm add={addTrackSub}/>
                            :
                            <UpdateForm update={updateTrackSub} changeForm={openAddForm} trackInfo={formControl.formValue}/>
                        }
                        <hr/>
                        { isLoading  ?  <Spinner/>:
                            (tracks.length === 0 ? <p>Пусто</p> :
                                <TrackList tracks={tracks} delTrack={deleteTrack} editPage={true} changeForm={openEditForm}/>)
                        }
                    </>
            }

            </div>
        </div>
        )
}