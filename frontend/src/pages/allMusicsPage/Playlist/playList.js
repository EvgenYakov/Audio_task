import {ReactComponent as Plus} from "../../../assets/plus.svg";
import {ReactComponent as EmptyImg} from "../../../assets/emptyImg.svg";
import Accordion from "../../../component/accordion/accordion";
import './playlist.css'


export default function PlayList(props){
    const playlists = [...props.playlists]
    console.log(playlists)
   return(
       <Accordion>
           {
               playlists.map((plst,index)=>{
                   return(
                   <div className="col" key={index} >
                           <div className="card bg-dark bg-opacity-50 ">
                               <div onClick={()=>props.onPlaylist(plst.tracks)}>
                                   {plst.url==="" ? <EmptyImg className="card-img-top"/> : <img src={plst.url} className="plstImg" alt="..."/>}
                               </div>
                               <div className="changTitle card-body ">
                                   <div className="change  text-center" style={{width:"100%"}}>
                                       <h5 className=" card-title ">{plst.label}</h5>
                                   </div>
                                   <button className="changBtn btn-primary btn-lg m-0 w-100 ">
                                       Изменить
                                   </button>
                               </div>
                           </div>
                   </div>
                   )
               })
           }
           <div className="col">
               <div className="card bg-dark bg-opacity-25">
                   <button className="btnPlst p-0" onClick={()=>props.setModalActive(true)}>
                       <Plus className="card-img-top opacity-50" />
                   </button>
               </div>
           </div>
       </Accordion>
   )
}