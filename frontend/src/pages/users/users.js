import './user.css'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {logout} from "../../store/Slice/AuthSlice";
import {deleteAdminUser, getUsers, resetUser, updateUser} from "../../store/Slice/UserSlice";
import {useNavigate} from "react-router-dom";
import UserList from "./userList/userList";
import {ReactComponent as Plus} from "../../assets/plus.svg";
import Modal from "../../component/modal/modal";
import {useRef, useState} from "react";
import ModalUserAdd from "./Modals/ModalUserAdd";
import ModalUserEdit from "./Modals/ModalUserEdit";


export default function Users(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [modalActive,setModalActive]=useState(false)
    const modalEdit = useRef(null);


    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )

    const {users, isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.user
        }
    )
    useEffect(() => {
        if (isError) {
            if (message===401) {
                toast.error("Время сеанса истекло")
                dispatch(resetUser())
                dispatch(logout())
                navigate('/auth')
                return
            }
            toast.error(message)
        }
        if (!user) {
            navigate('/auth')
        }
        if (user.role !=='admin') {
            navigate('/')
        }
        dispatch(getUsers())
        return () => {
            dispatch(resetUser())
        }
    }, [navigate, isError, message, dispatch])


    useEffect(()=>{
        console.log(users)
    },[users])

    const userUp = (id)=>{
        const newUser = {...users.find(user=>user._id===id)}
        newUser.role="admin";
        dispatch(deleteAdminUser(newUser._id))
        dispatch(updateUser(newUser))
    }


    const openAddModal = ()=>{
        modalEdit.current = null;
        setModalActive(true)
    }

    const openEditModal = (user)=>{
        modalEdit.current = user;
        setModalActive(true)
    }

    return (
        <div className="userPage">
            <div className="mBody">
                <h1>
                    Список пользователей
                </h1>
                <div className="userControls">
                    <button
                        aria-label="Добавить пользователя"
                        className="plus"
                        style={{
                            border: 'none',
                            cursor: 'pointer',
                            margin:"0 5px"
                        }}
                        onClick={openAddModal}
                    >
                        <Plus/>
                    </button>
                </div>
                <UserList users={users} userUp={userUp}  openEditModal = {openEditModal}/>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                {modalEdit.current ?
                    <ModalUserEdit setActive={setModalActive} active={modalActive} user = {modalEdit.current}/>:
                    <ModalUserAdd setActive={setModalActive} active={modalActive}/>
                }
            </Modal>
        </div>

    )
}