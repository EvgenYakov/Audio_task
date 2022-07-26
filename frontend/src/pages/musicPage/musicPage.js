import {useLocation, useNavigate} from "react-router-dom";
import './musicPage.css'
import Cbutton from "../../UI/CButton/cbutton";
import CommentList from "./CommentList/CommentList";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getComments, addComment, resetTrack} from "../../store/Slice/trackSlice";
import {ReactComponent as Music} from "../../assets/music.svg";
import {useEffect} from "react";

export default function MusicPage(props){
    const location = useLocation()
    const navigate = useNavigate()
    const [commentValue,setCommentValue]=useState("");
    const dispatch = useDispatch()
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    const {tracks,comments,isLoading,isSuccess } = useSelector(
        (state) => {
            return state.track
        }
    )

    const [track,setTrack] = useState({
    ...tracks[0]
    })

    useEffect(() => {
        dispatch(getComments(track._id))
        return () => {
            dispatch(resetTrack())
        }
    }, [navigate, dispatch])


    const addComm = (e)=>{
        e.preventDefault()
        const name = user.name === "" ? user.email : user.name;
        const comment = {
            id:track._id,
            data:{
                name,
                userId: user._id,
                text: commentValue
            }
        }
        console.log(123)
        dispatch(addComment(comment))
    }

    return (
        <div className="MusicPage">
            <div className="mBody">
                <div className="individualTrack">
                    <h1 style={{textAlign:'center'}}>
                        Страница трека
                    </h1>
                    <div className='big-info'>
                        {track.url ?  <img src={track.url} className="big-image"/> : <Music className="big-image"/>}
                        <div>
                            <p className="fs-1">{track.label}</p>
                            <p className="fs-2 fw-normal opacity-50">{track.author}</p>
                            <div style={{display:'flex', flexDirection:"row"}}>
                                <p className="fs-3">🔊 {track.numOfAud}</p>
                                <p className="fs-3 ms-5">💓{track.numOfLks}</p>
                            </div>
                        </div>
                    </div>
                    <p className="fs-3 mt-5 ms-2">Комментарии</p>
                    <hr/>
                    {
                        !user ?
                            <>
                            </>
                            :
                            <form className="commentForm" onSubmit={e=>addComm(e)}>
                                <div className="form-floating opacity-50">
                            <textarea className="form-control w-100" placeholder="Leave a comment here" id="floatingTextarea" style={{height: "100px"}}
                                      value={commentValue} onChange={(e)=>{setCommentValue(e.target.value)}}
                            />
                                    <label htmlFor="floatingTextarea">Оставить комментарий</label>
                                </div>
                                <Cbutton style = "w-25 btn-secondary btn-lg m-2">
                                    Добавить
                                </Cbutton>
                            </form>
                    }
                    {
                        comments.length !== 0 ?
                            <CommentList items = {comments}/>
                            :<></>
                    }
                </div>
            </div>
        </div>
    )
}