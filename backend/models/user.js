
const {Schema,model} = require('mongoose');

const userSchema = Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required: true,
            unique: true,
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true
        },
        liked:[
            {
                trackId:{
                    type: Schema.Types.ObjectId,
                    ref:'Track',
                    required:true
                }
            }
        ],
        playlists:[
            {
                plstId:{
                    type: Schema.Types.ObjectId,
                    ref:'Playlist',
                    required:true
                }
            }
        ]


    }

)

module.exports = model('User', userSchema)
