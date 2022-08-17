import './userList.scss'
import {ReactComponent as Up} from "../../../assets/upArrow.svg";
import {ReactComponent as Pencil} from "../../../assets/pencil.svg";


export default function UserList(props){
    return(
        <ul>
            {
                props.users.map((user,index)=>{
                    return(
                        <li className="userLi" key={index}>
                            <div className="userInfo">
                                <label className="fw-bold" >{user.name}</label>
                                <label className="fw-ligh" style={{padding:'5px'}}>{user.email}</label>
                            </div>
                            <div className="trackControls">
                                <button
                                    aria-label="Повысить"
                                    className="delete"
                                    style={{
                                        border: 'none',
                                        cursor: 'pointer',
                                        margin:"0 5px"
                                }}
                                    onClick={()=>props.userUp(user._id)}
                                >
                                    <Up/>
                                </button>

                                <button
                                    aria-label="Изменить"
                                    className="pencil"
                                    style={{
                                        border: 'none',
                                        cursor: 'pointer',
                                        margin:"0 5px"
                                }}
                                    onClick={()=>props.openEditModal(user)}
                                >
                                    <Pencil/>
                                </button>
                            </div>

                        </li>
                    )
                })
            }

        </ul>
    )
}