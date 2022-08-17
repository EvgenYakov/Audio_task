import './modal.scss'


export default function Modal(props){
    return(
        <div className={props.active ? "modal active" : "modal"} onClick={()=>props.setActive(false)}>
            <div className={props.active ? "modal_content active" : "modal_content"} onClick={e=>e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    )
}