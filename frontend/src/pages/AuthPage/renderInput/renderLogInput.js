import Cinput from "../../../UI/CInput/Cinput";


export default function RenderLogInput({formCntrlsKeys,logForm,onChange}){
    return formCntrlsKeys.map((controlName,index)=>{
        const control = logForm[controlName];
        return(
            <Cinput
                key = {index}
                id={control.id}
                place = {control.place}
                type = {control.type}
                label={control.label}
                onChange={e=>onChange(e,controlName)}
            />
        )
    })
}