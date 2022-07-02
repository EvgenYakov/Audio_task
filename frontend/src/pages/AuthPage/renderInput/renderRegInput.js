import Cinput from "../../../UI/CInput/Cinput";


export default function RenderRegInput({formCntrlsKeys,regForm,onChange}){
    return formCntrlsKeys.map((controlName,index)=>{
        const control = regForm.formControls[controlName];
        return(
            <Cinput
                key = {index}
                id={control.id}
                place = {control.place}
                type = {control.type}
                label={control.label}
                errorMessage = {control.errorMessage}
                valid={control.valid}
                touch={control.touch}
                shouldVal={control.shouldVal}
                onChange={e=>onChange(e,controlName)}
            />
        )
    })
}