const {Schema,model} = require('mongoose');


const tokenSchema = Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            required:true
        },
        refreshToken:{
            type:String,
            required: true
        }
    }
)

module.exports = model('Tokens', tokenSchema)