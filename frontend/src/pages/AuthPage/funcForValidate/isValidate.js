import is from "is_js";

export default function isValidate(value,validation,passValue){
    if(!validation){
        return true;
    }

    let val = true;

    if(validation.required){
        val = value.trim() !== '' && val;
    }

    if(validation.email){
        val = is.email(value) && val;
    }

    if(validation.minLength){
        val = value.length >= validation.minLength && val;
    }

    if(validation.isTruePass){
        val = value === passValue  && val;
    }


    return val
}