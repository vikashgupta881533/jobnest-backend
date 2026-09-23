const {createJob,getJobs,getMyJobs,getAllJobsAdmin,updateJobStatus,toggleSaveJob,getSavedJobs,getJobById,getCompanies,updateJob,deleteJob} = require('../controller/jobcontroller')

const express = require('express');
const authmiddle = require('../middleware/middleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/jobs', getJobs)                                                  // public, candidates browse
router.post('/jobs', authmiddle, checkRole('recruiter'), createJob)           // recruiter creates
router.get('/jobs/my', authmiddle, checkRole('recruiter'), getMyJobs)         // recruiter's own jobs

router.get('/jobs/saved', authmiddle, checkRole('candidate'), getSavedJobs)
router.post('/jobs/:id/save', authmiddle, checkRole('candidate'), toggleSaveJob)

router.get('/companies', getCompanies)                                        // public, Companies page

router.patch('/jobs/:id', authmiddle, checkRole('recruiter'), updateJob)
router.delete('/jobs/:id', authmiddle, checkRole('recruiter'), deleteJob)

// IMPORTANT: ye hamesha sabse neeche rakhna (jobs/my, jobs/saved ke baad) —
// warna ye unko bhi ":id" samajh ke pakad lega
router.get('/jobs/:id', getJobById)

router.get('/admin/jobs', authmiddle, checkRole('admin'), getAllJobsAdmin)
router.patch('/admin/jobs/:id/status', authmiddle, checkRole('admin'), updateJobStatus)

module.exports = router
