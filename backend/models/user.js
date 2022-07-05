
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
                    type: Schema.Types.ObjectId,
                    ref:'Track',
                    required:true
            }
        ],
        playlists:[
            {
                    type: Schema.Types.ObjectId,
                    ref:'Playlist',
                    required:true
            }
        ]

    }

)


userSchema.methods.likeTrack = (trackId)=>{
    try {
        const liked = this.liked.slice(0)
        liked.push(trackId)
        this.liked = liked;
        console.log(this)
        return this.save();
    }catch (e) {
        console.log(e)
    }

}


module.exports = model('User', userSchema)
