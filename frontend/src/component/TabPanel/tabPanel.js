import './tabPanel.scss'


export default function TabPanel (props){
    return(
        <ul className="nav nav-tabs">
            <li className="nav-item" key={0} >
                <a className={props.activePage === 0 ? "nav-link active" : "nav-link"} aria-current="page"  onClick={() => props.onClickOnTab(0)}>Вход</a>
            </li>
            <li className="nav-item" key={1} >
                <a className={props.activePage === 1 ? "nav-link active" : "nav-link"} aria-current="page"  onClick={() => props.onClickOnTab(1)}>Регистрация</a>
            </li>

        </ul>
    )
}