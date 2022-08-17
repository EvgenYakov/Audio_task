import Cinput from "../../../UI/CInput/Cinput";
import Cbutton from "../../../UI/CButton/cbutton";
import {useState,useEffect} from "react";
import {useDispatch} from "react-redux";
import {addUser} from "../../../store/Slice/UserSlice";
import {toast} from "react-toastify";
import is from "is_js";

export default function ModalUserAdd(props) {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:""
    })
    const {name, email,password} = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    useEffect(()=>{
        setFormData({
            name:"",
            email:"",
            password:""
        })
    },[props.active])

    const onAddUser= (e)=>{
        e.preventDefault()
        if (email==="" || password==="" || !is.email(email))  {
            toast.error("Данные введены не корректно")
            return
        }
        const userData = {
            name,
            email,
            password
        }
        dispatch(addUser(userData))
        props.setActive(false)
    }

    return (
        <form className="addPlst" onSubmit={onAddUser}>
            <Cinput
                id="floatingText"
                place = "Track"
                label="Введите имя"
                name="name"
                value={name}
                onChange ={onChange}
            >
            </Cinput>
            <Cinput
                id="floatingText"
                place = "Track"
                label="Введите email"
                name="email"
                value={email}
                onChange ={onChange}
            >
            </Cinput>
            <Cinput
                id="passwordInput"
                place = "Password"
                label="Введите пароль"
                name="password"
                type='password'
                value={password}
                onChange ={onChange}
            >
            </Cinput>
            <Cbutton  style = "btn-primary btn-lg">
                Добавить
            </Cbutton>
        </form>
    )
}