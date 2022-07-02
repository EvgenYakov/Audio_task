const {Schema,model} = require('mongoose');


const plstSchema = Schema(
    {
        label:{
            type:String,
            required:true
        },
        url:{
            type:String
        },
        category:{
            type:Boolean,
            required:true
        },
        tracks:[
            {
                    type: String,
                    ref:'Track',
                    required:true
            }
        ]

    }
)


module.exports = model('Playlist', plstSchema)