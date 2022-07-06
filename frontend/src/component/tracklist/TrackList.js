
import {ReactComponent as Music} from "../../assets/music.svg";
import './TrackList.css'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ControlsForUser from "./controlsForUser/controlsForUser";
import ControlsForAdmin from "./controlsForAdmin/controlsForAdmin";
import ControlsForPlaylist from "./controlsForPlaylist/controlsForPlaylist";
import {ReactComponent as Play} from "../../assets/play.svg";

function TrackList(props){
    const tracks =props.tracks ? [...props.tracks] : null;
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    return (
        <ul style={{width:"100%"}}>
            {
                tracks.map((track,index)=>{
                return (
                    <li className="track" key={index}>
                        <div className="info">
                            {track.url ?  <img src={track.url} className="small-img"/> : <Music className="small-img"/>}
                            <div>
                                <p className="fw-bold m-0">{track.label} -&nbsp;</p>
                                <p className="fw-normal opacity-50" >{track.numOfAud}</p>
                            </div>
                            <div>
                                <p className="fw-normal m-0" >{track.author}</p>
                            </div>
                        </div>
                        <div className="trackControls">
                            {!user ?
                                    <button
                                        aria-label="Play"
                                        className="play"
                                        style={{
                                            border: 'none',
                                            cursor: 'pointer'}}
                                        onClick={()=>props.playTrack(track._id)}
                                    >
                                        <Play/>
                                    </button>
                                    :
                                    (!props.forModal ?
                                        (
                                            <>
                                                {props.editPage ?
                                                    <ControlsForAdmin track={track} delTrack={props.delTrack} changeForm={props.changeForm}/>
                                                    :
                                                    <ControlsForUser track = {track} user={user} onLike={props.onLike} playTrack={props.playTrack}
                                                                     onDisLike={props.onDisLike} index={index} activeTrack={props.activeTrack}/>
                                                 }
                                            </>
                                        )
                                        :
                                            (
                                                <ControlsForPlaylist
                                                    track={track} playlist={props.playlist}
                                                    delFromPlaylist={props.delFromPlaylist}
                                                    pushInPlaylist={props.pushInPlaylist}
                                                />
                                            )
                                        )
                                    }

                        </div>
                    </li>
                )
                }
                )
            }
    </ul>
    )
}

export default TrackList