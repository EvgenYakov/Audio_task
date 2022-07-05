import {ReactComponent as Delete} from "../../../assets/garbage.svg";
import {ReactComponent as Pencil} from "../../../assets/pencil.svg";


export default function ControlsForAdmin(props){
    const track = {...props.track}
    return(
        <>
            <button
                aria-label="Удалить"
                className="delete"
                style={{
                    border: 'none',
                    cursor: 'pointer'}}
                onClick={()=>props.delTrack(track._id)}
            >
                <Delete/>
            </button>
            <button
                aria-label="Изменить"
                className="pencil"
                style={{
                    border: 'none',
                    cursor: 'pointer'}}
                onClick={()=>props.changeForm(track)}
            >
                <Pencil/>
            </button>

        </>
    )
}
