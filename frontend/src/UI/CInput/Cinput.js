import {React} from "react";
import "./Cinput.css"

function isInvalid({valid,shouldVal,touch}){
    return !valid && touch && shouldVal
}

export default function Cinput(props){
    const typeIn = props.type || 'text';
    const cls = ["form-control"];
    if(isInvalid(props)){
        cls.push("is-invalid");
    }
    return (
        <div className="form-floating">
            <input type={typeIn} className={cls.join(' ')} id={props.id} value={props.value} placeholder={props.place} onChange={props.onChange} name={props.name}/>
                <label htmlFor={props.id}>{!isInvalid(props)? props.label : props.errorMessage}</label>
        </div>
    )
}