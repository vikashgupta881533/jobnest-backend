const { usersign,userlogin,getProfile,listRecruiters,approveRecruiter,updateProfile,uploadResume,uploadPhoto,getAdminStats,forgotPassword,resetPassword } = require('../controller/usercontroller')

const express = require('express');
const authmiddle = require('../middleware/middleware');
const checkRole = require('../middleware/roleMiddleware');
const { resumeUpload, photoUpload } = require('../middleware/upload');
const router = express.Router();


 router.post('/usersign',usersign)

 router.post('/userlogin',userlogin)

 router.post('/forgot-password',forgotPassword)
 router.post('/reset-password',resetPassword)

 router.get('/profile',authmiddle,getProfile)
 router.patch('/profile',authmiddle,updateProfile)
 router.post('/profile/resume',authmiddle,resumeUpload.single('resume'),uploadResume)
 router.post('/profile/photo',authmiddle,photoUpload.single('photo'),uploadPhoto)

 router.get('/admin/stats',authmiddle,checkRole('admin'),getAdminStats)
 router.get('/admin/recruiters',authmiddle,checkRole('admin'),listRecruiters)
 router.patch('/admin/recruiters/:id/approve',authmiddle,checkRole('admin'),approveRecruiter)


 module.exports = router

