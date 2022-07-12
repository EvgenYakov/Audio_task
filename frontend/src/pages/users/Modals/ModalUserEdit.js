import Cinput from "../../../UI/CInput/Cinput";
import Cbutton from "../../../UI/CButton/cbutton";
import {useState,useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, updateUser} from "../../../store/Slice/UserSlice";
import is from "is_js";
import {toast} from "react-toastify";


export default function ModalUserEdit(props){

    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name:props.user.name,
        email:props.user.email,
        password:""
    })
    const {name, email,password} = formData

    useEffect(()=>{
        setFormData({
            name:props.user.name,
            email:props.user.email,
            password:""
        })
    },[props.active])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const deleteSubUser = (id)=>{
        dispatch(deleteUser(id))
        props.setActive(false)
    }

    const editSubUser =(e)=>{
        e.preventDefault()
        if (email==="" || !is.email(email))  {
            toast.error("Данные введены не корректно")
            props.setActive(false)
            return
        }
        const user = {...props.user}
        user.name = name;
        user.email = email;
        user.password = password;
        dispatch(updateUser(user))
        props.setActive(false)
    }

    return(
        <form className="addPlst" onSubmit={editSubUser}>
            <Cinput
                id="floatingText"
                place = "User"
                label="Введите имя пользователя"
                name="name"
                value={name}
                onChange ={onChange}
            >
            </Cinput>
            <Cinput
                id="floatingText"
                place = "User"
                label="Введите email пользователя"
                name="email"
                value={email}
                onChange ={onChange}
            >
            </Cinput>
            <Cinput
                id="floatingText"
                place = "Password"
                label="Введите пароль"
                name="password"
                type='password'
                value={password}
                onChange ={onChange}
            >
            </Cinput>
            <button type="submit"  className = "btn btn-success btn-lg">
                Изменить
            </button>
            <button type="button" className = "btn btn-danger btn-lg" onClick={()=>deleteSubUser(props.user._id)}>
                Удалить
            </button>

        </form>
    )
}