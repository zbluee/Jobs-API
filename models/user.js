import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'name is required'],
        minLength : 3,
        maxLength : 50
    },
    email : {
        type : String,
        required : [true, 'email must be provided'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                , 'invalid email address'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'please provide a password'],
        minLength : [6, 'should contain more than 6 characters']
    }
});

/**In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise.
 In particular, you can use async/await. **/

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.createJWT = function() {
    return jwt.sign({userId : this._id, name : this.name}, process.env.SOME_64BYTE_BASE64_STRING, {expiresIn : process.env.JWT_LIFETIME});
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
export {User}