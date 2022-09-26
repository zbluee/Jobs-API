import { Job } from '../models/job.js';
import {StatusCodes} from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/errors.js';

const getJobs = async (req, res) => {
    
    const jobs = await Job.find({createdBy : req.user.Id}).sort('createdAt');
    res.status(StatusCodes.OK).json({success : true, jobs, size : jobs.length});
}

const createJobs = async (req, res) => {
    
    const job = await Job.create({...req.body, createdBy : req.user.Id})
    res.status(StatusCodes.CREATED).json({success : true, job, msg : 'Successfully Created'});
}

const getJob = async (req, res) => {
    const {params : {id:jobId}, user : {Id : userId} } = req;
    const job = await Job.findOne({
        _id : jobId,
        createdBy : userId
    });

    if(!job) throw new NotFoundError(`No job with id : ${jobId} found `);
    res.status(StatusCodes.OK).json({success : true, job});
}

const updateJob = async (req, res) => {
    const {params : {id : jobId}, user : {Id : userId}, body : {company, position}} = req;
    
    if (company === '' || position === '') throw new BadRequestError('required');
    const job = await Job.findOneAndUpdate({
        _id : jobId, 
        createdBy : userId}, req.body, {
            new : true,
            runValidators : true
        });
    if (!job) throw new NotFoundError(`No job with id : ${jobId} found`);
    res.status(StatusCodes.OK).json({success : true, job, msg : 'Seccessfully Updated'});
}
const deleteJob = async (req, res) => {
    const {params : {id : jobId}, user : {Id : userId}} = req;
    const job = await Job.findOneAndDelete({
        _id : jobId,
        createdBy : userId
    });
    if (!job) throw new NotFoundError(`No job with id : ${jobId} found`);
    res.status(StatusCodes.OK).json({success : true, msg : 'Successfully Deleted'});
}

export {createJobs, deleteJob, getJob, getJobs, updateJob}