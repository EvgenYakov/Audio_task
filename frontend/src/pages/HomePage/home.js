import "./home.css"
import {useEffect,useState,useRef} from "react";


export default function Home(){
    return (
        <div className="Home">
            <div className="mBody">
                <h1>
                    Тут будет Музыка и аудио
                </h1>
                <audio controls={true}>
                    <source src="/api" type="audio/mp3"/>
                </audio>
                <h2>
                    Популярное
                </h2>
                <hr/>
            </div>
        </div>
    )
}