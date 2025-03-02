const mdb=require('mongoose')

const signupSchema=mdb.Schema({
    firstName:String,
    email:String,
    password:String,
    phoneNumber:Number,
    role:{
        type: String,
        default: "user",
    },
    borrowHistory: [
        {
          bookId: { type: mdb.Schema.Types.ObjectId, ref: "Book" },
          borrowDate: { type: Date, default: Date.now },
          dueDate: { type: Date, required: true },
          returned: { type: Boolean, default: false },
        },
    ],
    
})

const signup_Schema=mdb.model("signup",signupSchema)
module.exports=signup_Schema