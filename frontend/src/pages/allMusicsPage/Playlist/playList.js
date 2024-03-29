import {ReactComponent as Plus} from "../../../assets/plus.svg";
import {ReactComponent as EmptyImg} from "../../../assets/emptyImg.svg";
import {ReactComponent as Heart} from "../../../assets/heartOff.svg";
import Accordion from "../../../component/accordion/accordion";
import './playlist.scss'
import {useSelector} from "react-redux";
import {useState} from "react";


export default function PlayList(props){
    const playlists = [...props.playlists]
    const [actPlaylist,setActPlaylist] = useState(null)
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )



    return(
       <Accordion>
           {
               playlists.map((plst,index)=>{
                   return(
                   <div className="col" key={index} >
                           <div className="card bg-dark bg-opacity-50 ">

                                   <div onClick={()=>props.onPlaylist(plst.tracks)}>
                                       {plst.url==="" ? <EmptyImg className="card-img-top "/> : <img src={plst.url} className="plstImg" alt="..."/>}
                                   </div>
                               {
                                   plst.category===false || user.role==='admin' ?
                                     <div className="changTitle change-card card-body ">
                                         <div className="change  text-center" style={{width:"100%"}}>
                                             <h5 className=" card-title ">{plst.label}</h5>
                                         </div>
                                         <button className="changBtn btn-primary btn-lg m-0 w-100 " onClick={()=>props.openEditModal(plst)}>
                                             Изменить
                                         </button>
                                     </div>
                                     :
                                     <div className=" card-body">
                                         <h5 className="card-title">{plst.label}</h5>
                                     </div>
                               }

                           </div>
                   </div>
                   )
               })
           }
           <div className="col">
               <div className="card bg-dark bg-opacity-50 ">
                   <div onClick={props.onLiked}>
                           <Heart className="card-img-top "/>
                   </div>
                   <div className="card-body">
                           <h5 className="card-title">Любимые</h5>
                   </div>
               </div>
           </div>

           <div className="col">
               <div className="card bg-dark bg-opacity-25">
                   <button className="btnPlst p-0" onClick={props.openAddModal}>
                       <Plus className="card-img-top opacity-50" />
                   </button>
               </div>
           </div>
       </Accordion>
   )
}