import React, {useEffect} from 'react'
import './header.css'
import RenderLinks from "./Links/RenderLinks";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout,reset} from "../../store/Slice/AuthSlice";
import {resetTrack} from "../../store/Slice/trackSlice";
import {resetPLaylist} from "../../store/Slice/PlaylistSlice";

export default function LinkHeader(props){
    const location = useLocation();
    const [activeLink, setActive] = useState(location.pathname);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    useEffect(()=>{
        setActive(location.pathname)
    },[navigate])

    function clickOnLink(to){
        setActive(to)
    }

    const onLogout = async () => {
        dispatch(logout())
        dispatch(reset())
        dispatch(resetTrack())
        dispatch(resetPLaylist())
        navigate('/auth')
    }

    return(
        <div className='LinkHeader'>
            <nav >
                <ul className="nav-links">
                    <h3 className="logo">
                        🅥🅖🅝 🅐🅤🅓🅘🅞
                    </h3>
                    <RenderLinks onClick={clickOnLink} activeLink={activeLink} onLogout = {onLogout}/>
                </ul>
                {
                    (user && (user.role==="admin" || user.role==="user"))
                        ?
                        <ul className="nav-links">
                            <li className="nav-route" onClick={onLogout} >
                                <a href="#top">выйти</a>
                            </li>
                        </ul>
                        : <></>
                }
            </nav>
            <main>
                {props.children}
            </main>
        </div>)
}