import {useSelector} from "react-redux";
import {useState} from "react";


export default function ListControl(props){
    const [searchVal, setSearchVal] = useState("");
    const {tracks} = useSelector(
        (state) => {
            return state.track
        }
    )

    const onSortCount = ()=>{
        const sortTracks = props.actTracks.slice(0);
        sortTracks.sort((a,b)=> b.numOfAud - a.numOfAud)
        props.setActiveTracks(sortTracks)
    }

    const onSortLiked = ()=>{
        console.log(props.actTracks)
        const sortTracks = props.actTracks.slice(0);
        sortTracks.sort((a,b)=> b.numOfLks - a.numOfLks)
        props.setActiveTracks(sortTracks)
    }

    const onAll = ()=>{
        props.setActiveTracks(tracks)
        props.setActiveTrack({
            index:0,
            fileId:tracks[0].fileId}
        );
    }

    const onSubSearch = (e)=>{
        e.preventDefault();
        const searchList = [...tracks].filter((track)=> (
            track.label.match(new RegExp(`${searchVal}`,'gi')) ||
            track.author.match(new RegExp(`${searchVal}`,'gi'))
            )
        );
        if (searchList.length === 0){
            return 0;
        }
        props.setActiveTracks(searchList);
        props.setActiveTrack({
            index:0,
            fileId:searchList[0].fileId}
        );
    }

    return(
        <div className="listControls">
            <div className="btn-group m-1">
                <button className="btn btn-dark m-0"  onClick={()=>onAll()}>Все</button>
                <button className="btn btn-dark m-0"  onClick={()=>onSortCount()} >Самые прослушиваемые</button>
                <button className="btn btn-dark m-0"  onClick={()=>onSortLiked()}>Популярные</button>
            </div>
            <form className="d-flex m-1" onSubmit={(e)=>onSubSearch(e)}>
                <input className="form-control me-2 opacity-75" type="search" placeholder="Поиск трека" value={searchVal} onChange={(e)=>{setSearchVal(e.target.value)}} aria-label="Search"/>
                <button className="btn btn-outline-light m-0" type="submit">Поиск</button>
            </form>
        </div>
    )
}