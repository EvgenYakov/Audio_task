import {ReactComponent as Play} from "../../assets/play.svg";
import {ReactComponent as Page} from "../../assets/audio.svg";
import {ReactComponent as Delete} from "../../assets/garbage.svg";
import {ReactComponent as HeartOn} from "../../assets/heartOn.svg";
import {ReactComponent as HeartOff} from "../../assets/heartOff.svg";
import {ReactComponent as AddPlst} from "../../assets/add.svg";
import {ReactComponent as Cross} from "../../assets/cross.svg";
import {ReactComponent as Music} from "../../assets/music.svg";
import {ReactComponent as Pencil} from "../../assets/pencil.svg";
import {useEffect,useState} from "react";
import './TrackList.css'
import {useNavigate} from "react-router-dom";

function TrackList(props){
    const navigate = useNavigate()
    const tracks =props.tracks ? [...props.tracks] : null;
    return (
        <ul style={{width:"100%"}}>
        {tracks===null ? <p> пусто</p>:
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
                                {!props.forModal ? (
                                    <>
                                        {props.editPage ?<> <button
                                            aria-label="Удалить"
                                            className="delete"
                                            style={{
                                                border: 'none',
                                                cursor: 'pointer'}}
                                            onClick={()=>props.delTrack(track._id)}
                                        >
                                            <Delete/>
                                        </button>
                                            <button
                                                aria-label="Изменить"
                                                className="pencil"
                                                style={{
                                                    border: 'none',
                                                    cursor: 'pointer'}}
                                                onClick={()=>props.changeForm(track)}
                                            >
                                                <Pencil/>
                                            </button>
                                        </> : <>
                                            {
                                                props.activeTrack===index ?
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
                                                onClick={()=>{navigate("/music/"+track._id, {state:{track} })}}
                                            >

                                                <Page/>
                                            </button>

                                            <button
                                                aria-label="Любимая"
                                                className="heartOn"
                                                style={{
                                                    border: 'none',
                                                    cursor: 'pointer'}}
                                            >
                                                <HeartOn/>
                                            </button>
                                            <button
                                                aria-label="Любимая"
                                                className="heartOff"
                                                style={{
                                                    border: 'none',
                                                    cursor: 'pointer'}}
                                            >
                                                <HeartOff/>
                                            </button>
                                        </> }

                                    </>
                                ) : (
                                    <>
                                        {
                                           props.playlist.find(id=>id==track._id)!==undefined
                                               ?
                                               <button
                                                   aria-label="Удалить из плейлиста"
                                                   className="Cross"
                                                   style={{
                                                       border: 'none',
                                                       cursor: 'pointer'}}
                                                   onClick={()=>props.delFromPlaylist(track._id)}
                                               >
                                                   <Cross/>
                                               </button>
                                                :
                                                <button
                                                    aria-label="добавить в плейлист"
                                                    className="AddPlst"
                                                    style={{
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={()=>props.pushInPlaylist(track._id)}
                                                >
                                                <AddPlst/>
                                                </button>
                                        }

                                    </>
                                    )}


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