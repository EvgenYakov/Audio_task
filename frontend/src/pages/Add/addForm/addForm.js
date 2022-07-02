import Cinput from "../../../UI/CInput/Cinput";
import Cbutton from "../../../UI/CButton/cbutton";
import {useEffect, useState} from "react";


export default function AddForm(props){
    const [formData, setFormData] = useState({
        label: '',
        author: '',
        url: ''
    })
    const [selectAudio, setSelectAudio] = useState(null)
    const { label, author, url} = formData
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const fileChangeHandler = (e)=>{
        setSelectAudio(e.target.files[0])
    }
    return(
            <div className="body">
                <h1>Добавление трека</h1>
                <form className="add_form " onSubmit={(e)=>props.add(e,{label, author, url},selectAudio)}>
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
                    <input style={{margin:'10px'}}
                           type="file"
                           id="input"
                           accept="audio/mpeg"
                           name="file"
                           onChange={fileChangeHandler} multiple/>
                    <Cbutton type="submit"  style = "btn-primary btn-lg " >
                           Добавить
                    </Cbutton>
                </form>
        </div>
    )
}