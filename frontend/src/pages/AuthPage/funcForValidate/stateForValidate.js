 const initialStateForFormReg ={
    isFormVal:true,
    formControls:{
        login: {
            type:'text',
            label:'Введите логин',
            value:'',
            place:"Login",
            id:"floatingText",
            valid:false,
            touch:false,
            shouldVal:true,
            validation: {
                required:false,
            }
        },
        email: {
            type:'email',
            label:'Email',
            value:'',
            errorMessage:"Введите корректный email",
            place:"name@example.com",
            id:"floatingInput",
            valid:false,
            touch:false,
            shouldVal:true,
            validation: {
                required:true,
                email: true
            }
        },
        password:{
            id:"passwordInput",
            type:'password',
            label:'Пароль',
            value:'',
            errorMessage:"Пароль - минимум 6 символов",
            place:"Password",
            valid:false,
            touch:false,
            shouldVal:true,
            validation: {
                required:true,
                minLength:6
            }
        },
        repPassword:{
            id:"passwordInput",
            type:'password',
            label:'Повторите пароль',
            value:'',
            errorMessage:"Пароли не совпадают",
            place:"Password",
            valid:false,
            touch:false,
            shouldVal:true,
            validation: {
                required:true,
                isTruePass: true
            }
        },

    }
}

 const initialStateForFormLog ={
         email: {
             id:"floatingInput",
             type:'email',
             label:'Email',
             value:'',
             place:"name@example.com",
         },
         password:{
             id:"passwordInput",
             type:'password',
             label:'Пароль',
             value:'',
             place:"Password",
         },
 }


export {initialStateForFormReg,initialStateForFormLog}