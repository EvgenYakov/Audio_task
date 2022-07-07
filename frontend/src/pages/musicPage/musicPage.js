import {useLocation} from "react-router-dom";
import './musicPage.css'
import Cbutton from "../../UI/CButton/cbutton";
import CommentList from "./CommentList/CommentList";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateTrack} from "../../store/Slice/trackSlice";
import {ReactComponent as Music} from "../../assets/music.svg";


export default function MusicPage(props){
    const location = useLocation()
    const [commentValue,setCommentValue]=useState("");
    const dispatch = useDispatch()
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    const [track,setTrack] = useState(location.state.track)
    console.log(track)
    const addComment = (e)=>{
        e.preventDefault()
        const commentedTrack = {...track}
        const name = user.name === "" ? user.email : user.name;
        const comment = {
            name,
            userId: user._id,
            text: commentValue
        }
        commentedTrack.comments.items.push(comment)
        setTrack(commentedTrack)
        dispatch(updateTrack(commentedTrack))
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
                    <form className="commentForm" onSubmit={e=>addComment(e)}>
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
                    <CommentList items = {track.comments.items}/>
                </div>
            </div>
        </div>
    )
}