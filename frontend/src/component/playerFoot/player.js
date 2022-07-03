import "./player.css"
import Controls from "./controls/controls";
import {useState,useEffect,useRef} from "react";
import {useDispatch} from "react-redux";
import {updateTrack} from "../../store/Slice/trackSlice";



export default function PlayerFooter({tracks,activeTrack,changeTrack}){
    const dispatch = useDispatch();

    const [trProgress, setTrProgress] = useState(0);
    const [trPlaying, setTrPlaying] = useState(false);
    const [trIn, setTrIn] = useState(0);
    const {fileId}= tracks[trIn];
    const [complete,setComplete] = useState(false);
    const [volume,setVolume] = useState(1)

    const isReady = useRef(false);
    const intervalRef = useRef();
    const audioRef = useRef( new Audio());
    const {duration} = audioRef.current

    const curPos = duration ? `${(trProgress / duration) * 100}%` : '0%';
    const trackStyle = `
     -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${curPos}, #fff), color-stop(${curPos}, #777))
     `;
    useEffect(() => {
            audioRef.current.pause();
            setTrIn(activeTrack)
        },
    [activeTrack] )

    useEffect(() => {
            setTrIn(0)
        },
        [tracks] )

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
        audioRef.current.src = '/music/stream/'+fileId
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, []);

    const completeCheck = ()=>{
        setComplete(true);
        audioRef.current.play().then();
        setTrPlaying(true);
        startTimer();
    }

    useEffect(()=>{
        audioRef.current.removeEventListener("canplay",completeCheck)
        audioRef.current.src ="/music/stream/"+fileId
        audioRef.current.pause();
        setComplete(false);
        changeTrack(trIn);
        const track = {...tracks[trIn]}
        track.numOfAud++;
        dispatch(updateTrack(track))

        setTrProgress(audioRef.current.currentTime)
        if ( isReady.current ){
            audioRef.current.addEventListener("canplay", completeCheck)
        } else {
            isReady.current = true;
        }
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
                    <img className="small-img" src={tracks[trIn].url}/>
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