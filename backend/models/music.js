const {Schema,model} = require('mongoose');


const trackSchema = Schema(
    {
        label:{
            type:String,
            required:true
       },
        author:{
            type:String,
            required:true
        },
        fileId:{
            type: Schema.Types.ObjectId,
            required: true
        },
        url:{
            type:String
        },
        numOfAud:{
            type:Number,
            default:0
        },
         numOfLks:{
             type:Number,
             default:0
        },
        comments:{
            items:[
                {
                    name: String,
                    userId:{
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required:true
                    },
                    text: String,
                }
            ]
        }

    }
)



module.exports = model('Track', trackSchema)