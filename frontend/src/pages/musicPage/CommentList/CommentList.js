import './CommentList.scss'

export default function CommentList(props){
    const items = [...props.items]
    return(
        <ul>
            {items.map((comment, index )=>{
                return(
                    <li className="comm" key={index}>
                        <label style={{backgroundColor:"rgba(0, 0, 0, 0.40)", borderRadius:'5px', padding:'5px'}}>
                            {comment.name}
                        </label>
                       <p  style={{ margin:'5px'}}>{comment.text}</p>
                    </li>
                )
            })}
        </ul>
    )
}