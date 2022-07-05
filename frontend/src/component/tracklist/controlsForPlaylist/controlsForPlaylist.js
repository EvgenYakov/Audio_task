import {ReactComponent as Cross} from "../../../assets/cross.svg";
import {ReactComponent as AddPlst} from "../../../assets/add.svg";


export default function ControlsForPlaylist(props){
    const track = {...props.track}
    return(
        <>
            {
                props.playlist.find(id=>id===track._id)!==undefined
                    ?
                    <button
                        aria-label="Удалить из плейлиста"
                        className="Cross"
                        style={{
                            border: 'none',
                            cursor: 'pointer'}}
                        onClick={()=>props.delFromPlaylist(track._id)}
                    >
                        <Cross/>
                    </button>
                    :
                    <button
                        aria-label="добавить в плейлист"
                        className="AddPlst"
                        style={{
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={()=>props.pushInPlaylist(track._id)}
                    >
                        <AddPlst/>
                    </button>
            }
        </>
    )


}