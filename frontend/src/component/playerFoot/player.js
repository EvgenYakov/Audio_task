import "./player.scss"
import Controls from "./controls/controls";
import {useState, useEffect, useRef, useLayoutEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as Music} from "../../assets/music.svg";
import {useSelector} from "react-redux";



export default function PlayerFooter({activeTrack,toNextTrack,toPrevTrack}){
    const location = useLocation();
    const navigate = useNavigate();
    const [trProgress, setTrProgress] = useState(0);
    const [trPlaying, setTrPlaying] = useState(false);
    const [complete,setComplete] = useState(true);
    const [volume,setVolume] = useState(1)
    const isReady = useRef(false);
    const intervalRef = useRef();
    const audioRef = useRef( new Audio());
    const {duration} = audioRef.current
    const [track,setTrack] = useState({})

    const curPos = duration ? `${(trProgress / duration) * 100}%` : '0%';
    const trackStyle = `
     -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${curPos}, #fff), color-stop(${curPos}, #777))
     `;

    const {tracks}=useSelector((state) => {
        return state.track
    })

    useEffect(() => {
            audioRef.current.src ="/stream/"+activeTrack.fileId
            audioRef.current.pause();
            setComplete(false);
            setTrProgress(audioRef.current.currentTime)
            audioRef.current.addEventListener("canplay", completeCheck)
            const track = tracks.find(track=>track.fileId===activeTrack.fileId)
            setTrack({...track})
        },
    [activeTrack] )

    useEffect(()=>{
        isReady.current=false;
        audioRef.current.removeEventListener("canplay",completeCheck)
    },[navigate])

     function startTimer(){
         clearInterval(intervalRef.current);
            intervalRef.current = setInterval(()=>{
             if(audioRef.current.ended) {
                 toNextTrack()
             }else{
                 setTrProgress(audioRef.current.currentTime)
             }
         },[1000])
     }

     useEffect(()=>{
         if (trPlaying){
              audioRef.current.play().then();
              startTimer();
         } else {
             clearInterval(intervalRef.current)
             audioRef.current.pause();
         }
     }, [trPlaying])

    useEffect(()=>{
        audioRef.current.volume=volume
    },[volume])

    useEffect(() => {
        audioRef.current.src = '/stream/'+activeTrack.fileId
        setComplete(true);
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
            audioRef.current.removeEventListener("canplay",completeCheck)
        }
    }, []);

    useLayoutEffect(() => () => {
        audioRef.current.removeEventListener("canplay",completeCheck)
    }, [])

    const completeCheck = (e)=>{
        if("http://localhost:3000"+location.pathname===e.path[0].baseURI){
            setComplete(true);
            audioRef.current.muted =false;
            setTrPlaying(true);
            if ( isReady.current ){
                audioRef.current.play().then();
                startTimer();
            } else {
                isReady.current = true;
            }

        } else {
            audioRef.current.src= "";
            audioRef.current.muted =true;
        }
        audioRef.current.removeEventListener("canplay",completeCheck)
    }

    function onScrub(value){
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrProgress(audioRef.current.currentTime)
    }

    function onScrubEnd(){
        if (!trPlaying) {
            setTrPlaying(true);
        }
        startTimer();
    }

    return(
        <div className="playFoot">
            <input
                type='range'
                value={trProgress}
                step='1'
                min={0}
                max={duration ? duration : `${duration}`}
                className="progress"
                onChange={(e)=> onScrub(e.target.value)}
                onMouseUp={onScrubEnd}
                onKeyUp={onScrubEnd}
                style={{ background: trackStyle }}
            />
            <div style={{display: "flex", flexDirection: "row", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Controls
                        isPlay={trPlaying}
                        toNextTrack={toNextTrack}
                        toPrevTrack={toPrevTrack}
                        setPlay={setTrPlaying}
                    />
                    {track.url ?  <img src={track.url} className="small-img playerImg"/> : <Music className="small-img playerImg"/>}
                    <div style={{margin:"0 20px"}}>
                        <p className="m-0">
                            {track.label}
                        </p>
                        <p className="m-0 fw-light">
                            {track.author}
                        </p>
                    </div>
                    {
                        ! complete ?
                            <div className="spinner-border text-light d-flex align-self-center" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>:
                            <></>
                    }
                </div>
                <input
                    type='range'
                    step='1'
                    max='10'
                    value={volume*10}
                    onChange={(e)=>setVolume(e.target.value*0.1)}
                    style={{width:"100px",margin:"20px", backgroundColor:"white"}}
                />
            </div>
        </div>

    )
}