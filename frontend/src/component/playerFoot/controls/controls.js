import React from "react";
import { ReactComponent as Play } from "../../../assets/play.svg";
import { ReactComponent as Next } from "../../../assets/next.svg";
import { ReactComponent as Prev } from "../../../assets/next.svg";
import { ReactComponent as Pause } from "../../../assets/pause.svg";
import './controls.scss'



function Controls(props){
    return(
        <div className="playerControls">
            <button type="button"
                    className="prev"
                    aria-label="Previous"
                    onClick={() => props.toPrevTrack()}
            >
                <Prev/>
            </button>

            {props.isPlay ? (
                <button
                    type="button"
                    className="pause"
                    onClick={() => props.setPlay(false)}
                    aria-label="Pause"
                >
                    <Pause />
                </button>) :(
                <button
                    type="button"
                    className="play"
                    onClick={() => props.setPlay(true)}
                    aria-label="Play"
                >
                    <Play />
                </button>
            )
            }
            <button
                type="button"
                className="next"
                aria-label="Next"
                 onClick={() => props.toNextTrack()}
            >
                <Next />
            </button>
        </div>
    )

}

export default Controls