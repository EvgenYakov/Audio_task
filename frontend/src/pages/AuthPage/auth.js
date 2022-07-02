import {React, useState,useEffect} from "react";
import Cbutton from "../../UI/CButton/cbutton";
import './auth.css'
import TabPanel from "../../component/TabPanel/tabPanel";
import isValidate from "./funcForValidate/isValidate";
import {initialStateForFormReg,initialStateForFormLog} from "./funcForValidate/stateForValidate";
import RenderRegInput from "./renderInput/renderRegInput";
import RenderLogInput from "./renderInput/renderLogInput";
import {useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from "react-toastify";
import {login, register, reset} from "../../store/Slice/AuthSlice";

function Auth(){
    const [regForm,setRegForm] = useState(initialStateForFormReg);
    const [logForm,setLogForm] = useState(initialStateForFormLog);
    const [logHand, setLogHand] = useState(0)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => {
            return state.auth
        }
    )
    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess && user) {
            navigate('/')
        }
        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])


    function onChangeHand(e,contName){
        const formControls = {...regForm.formControls};
        const control = {...formControls[contName]};
        control.value = e.target.value;
        control.touch = true;
        control.valid = isValidate(control.value, control.validation, formControls.password.value);
        let isFormVal = true;
        formControls[contName] = control;
        Object.keys(formControls).map((name)=>{
            isFormVal = formControls[name].valid && isFormVal
        })
        setRegForm({
            isFormVal,formControls
        })
    }

    function onChangeLog(e,contName){
        const logCont = {...logForm}
        const control = {...logCont[contName]};
        control.value = e.target.value;
        logCont[contName] = control;
        setLogForm({...logCont})
    }


    const regUser = (e) =>{
        e.preventDefault();
        const registerForm = {...regForm.formControls};
        const userData  = {
            name:registerForm.login.value,
            email:registerForm.email.value,
            password:registerForm.password.value,
        }
        dispatch(register(userData))
    }

    const logUser = (e)=>{
        e.preventDefault();
        const loginForm = {...logForm};
        const userData  = {
            email:loginForm.email.value,
            password:loginForm.password.value,
        }
        dispatch(login(userData))
    }


    return(
        <div className='Auth'>
            <h1>Аутентификация</h1>
            <TabPanel activePage = {logHand} onClickOnTab = {setLogHand}/>
            {
                logHand === 0 ?
                    (
                    <form className='Auth-form' onSubmit={logUser}>
                        <RenderLogInput formCntrlsKeys={Object.keys(logForm)} logForm={logForm} onChange={onChangeLog}/>
                        <Cbutton style = "w-50 btn-primary btn-lg mt-4" >
                            Войти
                        </Cbutton>
                    </form>
                    ):(
                    <form className='Auth-form'  onSubmit={regUser}>
                        <RenderRegInput formCntrlsKeys={Object.keys(regForm.formControls)} regForm={regForm} onChange={onChangeHand}/>
                        <Cbutton style = " btn-success btn-lg mt-4"  disabled={!regForm.isFormVal}>Зарегистрироваться</Cbutton>
                    </form>
                )
            }

        </div>
)
}



export default Auth