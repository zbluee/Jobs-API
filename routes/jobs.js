import express from 'express';
import { createJobs, deleteJob, getJob, getJobs, updateJob } from '../controllers/jobs.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(createJobs)
router.route('/:id')
    .get(getJob)
    .patch(updateJob)
    .delete(deleteJob);

export {router as jobsRoute}