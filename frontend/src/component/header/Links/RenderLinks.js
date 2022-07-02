import {NavLink} from "react-router-dom";
import './RenderLinks.css'
import {useSelector} from "react-redux";

const linksForAdmin = [
    {to:'/', exact: true, label: "Главная"},
    {to:'/add', label:"Добавить трек", exact: false},
    {to:'/music', label:"Музыка", exact: false},
    {to:'/users', label:"Список пользователей", exact: false}
]

const linksForUser = [
    {to:'/', exact: true, label: "Главная"},
    {to:'/music', label:"Музыка", exact: false},
]

const linksForGuest = [
    {to:'/', exact: false ,  label: "Главная"},
    {to:'/auth', label: "Аутентификация", exact: true},
]


export default function RenderLinks(props){
    const {user} = useSelector(
        (state) => {
            return state.auth
        }
    )
    const role = user ? user.role : null;
    let links;
    if (role === "user"){
        links =  linksForUser.map((link,i) =>
            <li className={link.to === props.activeLink ? "nav-route active" : "nav-route"} key={i}>
                <NavLink to={link.to} exact={`${link.exact}`} onClick={() => props.onClick(link.to)}>
                    {link.label}
                </NavLink>
            </li>
        )
    } else
    if (role === "admin") {
        links = linksForAdmin.map((link,i) =>
            <li className={link.to === props.activeLink ? "nav-route active" : "nav-route"} key={i}>
                <NavLink to={link.to} exact={`${link.exact}`} onClick={() => props.onClick(link.to)}>
                    {link.label}
                </NavLink>
            </li>
        )
    }
    else{
        links = linksForGuest.map((link,i) =>
            <li className={link.to === props.activeLink ? "nav-route active" : "nav-route"} key={i}>
                <NavLink to={link.to} exact={`${link.exact}`} onClick={() => props.onClick(link.to)}>
                    {link.label}
                </NavLink>
            </li>
        )
    }



    return (links
    )
}