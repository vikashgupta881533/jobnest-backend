const {applyToJob,getMyApplications,getApplicationsForJob,updateApplicationStatus,getApplicationsForRecruiter} = require('../controller/applicationcontroller')

const express = require('express');
const authmiddle = require('../middleware/middleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/applications', authmiddle, checkRole('candidate'), applyToJob)
router.get('/applications/my', authmiddle, checkRole('candidate'), getMyApplications)

router.get('/applications/recruiter', authmiddle, checkRole('recruiter'), getApplicationsForRecruiter)
router.get('/applications/job/:jobId', authmiddle, checkRole('recruiter'), getApplicationsForJob)
router.patch('/applications/:id/status', authmiddle, checkRole('recruiter'), updateApplicationStatus)

module.exports = router
