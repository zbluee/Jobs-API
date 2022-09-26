import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    company : {
        type : String,
        required : [true, 'company name is required'],
        maxLength : 50,
    },
    position : {
        type : String,
        required : [true, 'position is required'],
        maxLength : 255
    },
    status : {
        type : String,
        enum : ['interview', 'declined', 'pending'],
        default : 'pending'
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : [true, 'please provide user']
    }
}, {timestamps : true});

const Job = mongoose.model('Job', jobSchema);

export {Job}