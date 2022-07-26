import {ReactComponent as Play} from "../../../assets/play.svg";
import {ReactComponent as Page} from "../../../assets/audio.svg";
import {ReactComponent as HeartOn} from "../../../assets/heartOn.svg";
import {ReactComponent as HeartOff} from "../../../assets/heartOff.svg";
import {useNavigate} from "react-router-dom";


export default function ControlsForUser(props){
    const navigate = useNavigate()
    const track = {...props.track}
    return(
        <>
            {
                props.activeTrack===track._id ?
                    <></>
                    : <button
                        aria-label="Play"
                        className="play"
                        style={{
                            border: 'none',
                            cursor: 'pointer'}}
                        onClick={()=>props.playTrack(track._id)}
                    >
                        <Play/>
                    </button>
            }
            <button
                aria-label="Страница"
                className="page"
                style={{
                    border: 'none',
                    cursor: 'pointer'}}
                onClick={()=>{navigate("/music/"+track._id, {state:{track}})}}
            >
                <Page/>
            </button>
            {
                props.user.liked.find(id=>id===track._id)!==undefined?
                    <button
                        aria-label="Любимая"
                        className="heartOn"
                        style={{
                            border: 'none',
                            cursor: 'pointer'}}
                        onClick={()=>props.onDisLike(track._id)}
                    >
                        <HeartOn/>
                    </button>
                    :
                    <button
                        aria-label="Любимая"
                        className="heartOff"
                        style={{
                            border: 'none',
                            cursor: 'pointer'}}
                        onClick={()=>props.onLike(track._id)}
                    >
                        <HeartOff/>
                    </button>
            }
        </>

)
}