import "./player.css"
import Controls from "./controls/controls";
import {useState, useEffect, useRef, useLayoutEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as Music} from "../../assets/music.svg";



export default function PlayerFooter({tracks,activeTrack,changeTrack,onAud}){
    const location = useLocation();
    const navigate = useNavigate();
    const [trProgress, setTrProgress] = useState(0);
    const [trPlaying, setTrPlaying] = useState(false);
    const [trIn, setTrIn] = useState(0);
    //const {fileId} = tracks[trIn];
    const [complete,setComplete] = useState(false);
    const [volume,setVolume] = useState(1)
    const isReady = useRef(false);
    const intervalRef = useRef();
    const audioRef = useRef( new Audio());
    const {duration} = audioRef.current
 //   const tracks= props.tracks ? JSON.parse(JSON.stringify(tracks)) : [];
    const [plTracks,setPlTracks] = useState([])

    const curPos = duration ? `${(trProgress / duration) * 100}%` : '0%';
    const trackStyle = `
     -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${curPos}, #fff), color-stop(${curPos}, #777))
     `;
    useEffect(() => {
            audioRef.current.pause();
            const index =tracks.findIndex((track)=>track._id===activeTrack)
            console.log(activeTrack)
            if (index!==trIn ){
                console.log(index)
                console.log(2222)

                setTrIn(index)
            }
        },
    [activeTrack] )

    useEffect(() => {
        const index =tracks.findIndex((track)=>track._id===activeTrack)
            if(index>tracks.length-1){
       console.log(tracks)
               setTrIn(0);
           }
            isReady.current = false;
        }, [tracks] )

    useEffect(()=>{
        audioRef.current.removeEventListener("canplay",completeCheck)
    },[navigate])

    function toPrevTrack (){
        if (trIn - 1 < 0){
            setTrIn(tracks.length-1);
        }else {
            setTrIn(trIn - 1)
        }
    }

    function toNextTrack (){
        if (trIn < tracks.length - 1 ){
            setTrIn(trIn + 1 )
        } else {
            setTrIn(0)
        }
    }

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
        audioRef.current.src = '/stream/'+tracks[trIn].fileId
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
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

    useEffect(()=>{
        const index =tracks.findIndex((track)=>track._id===activeTrack)
        audioRef.current.src ="/stream/"+tracks[trIn].fileId
        audioRef.current.pause();
        setComplete(false);
        changeTrack(tracks[trIn]._id);
        setTrProgress(audioRef.current.currentTime)
        audioRef.current.addEventListener("canplay", completeCheck)
    },[trIn,tracks])


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
                    {tracks[trIn].url ?  <img src={tracks[trIn].url} className="small-img playerImg"/> : <Music className="small-img playerImg"/>}
                    <div style={{margin:"0 20px"}}>
                        <p className="m-0">
                            {tracks[trIn].label}
                        </p>
                        <p className="m-0 fw-light">
                            {tracks[trIn].author}
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