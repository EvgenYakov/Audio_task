import React from 'react'
import './cbutton.css'

function Cbutton(props){
    const masstyle = ["btn"];
    if (props.style!==""){
        masstyle.push(props.style)
    }
    return(
        <button className={masstyle.join(" ")} disabled = {props.disabled} >
            {props.children}
        </button>
    )
}

export default Cbutton