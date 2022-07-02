import Cinput from "../../../UI/CInput/Cinput";
import Cbutton from "../../../UI/CButton/cbutton";
import {useEffect, useState} from "react";


export default function UpdateForm(props){
    const [formData, setFormData] = useState(props.trackInfo)
    const { label, author, url} = formData
    const onChange = (e) => {
        console.log(e.target.value)
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(()=>{
        setFormData(props.trackInfo);
    },[props.trackInfo])

    return(
            <div className="body">
                <h1>Изменение трека</h1>
                <form className="add_form " onSubmit={(e)=>props.update(e,formData)}>
                    <Cinput
                        id="floatingText"
                        place = "Track"
                        label="Введите название трека"
                        name="label"
                        value={label}
                        onChange ={onChange}
                    >
                    </Cinput>
                    <Cinput
                        id="floatingText"
                        place = "Track"
                        label="Введите автора"
                        name="author"
                        value={author}
                        onChange ={onChange}
                    >
                    </Cinput>
                    <Cinput
                        id="floatingText"
                        place = "Track"
                        label="Введите URL картинки"
                        name="url"
                        value={url}
                        onChange ={onChange}
                    >
                    </Cinput>
                    <button type="submit" className = "btn btn-success btn-lg " >
                        Изменить
                    </button>
                    <button type="button" className= "btn btn-outline-primary btn-lg "  onClick={props.changeForm}>
                        Добавить
                    </button>
                </form>
        </div>
    )
}