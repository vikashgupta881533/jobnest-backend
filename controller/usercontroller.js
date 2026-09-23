const usermodel = require('../model/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {createNotification} = require('./notificationcontroller')


const usersign = async(req,res)=>{
    const {name,email,phone,password,role} = req.body

    const hashpass = await bcrypt.hash(password,10)

    const data = await usermodel.create({
        name,email,phone,password:hashpass,role
    })

    res.json("account created")

}




const userlogin = async(req,res)=>{
    const {email,password} = req.body
    const data = await usermodel.findOne({email})

    if(!data){
        return res.json("user not found")
    }

    const comp = await bcrypt.compare(password,data.password)

     if(!comp){
        res.json("wrong password")
     }else{

         let token = jwt.sign({
            userid:data.id,
            role: data.role
    
        },
    
        "secretkey"
    )

        res.json({token:token,role:data.role, name:data.name})
     }
}

// GET /profile  (needs authmiddle) — returns the logged-in user's own data
const getProfile = async(req,res)=>{
    const data = await usermodel.findById(req.user.userid).select("-password")
    res.json(data)
}

// GET /admin/recruiters  (admin only) — list recruiters, e.g. for the
// "recent recruiter approvals" table on the admin dashboard
const listRecruiters = async(req,res)=>{
    const data = await usermodel.find({role:"recruiter"}).select("-password")
    res.json(data)
}

// PATCH /admin/recruiters/:id/approve  (admin only)  body: { isApproved: true | false }
const approveRecruiter = async(req,res)=>{
    const {isApproved} = req.body

    const data = await usermodel.findByIdAndUpdate(
        req.params.id,
        { isApproved: isApproved },
        { new: true }
    )

    if(data){
        await createNotification(
            data._id,
            isApproved ? "Your recruiter account has been approved — you can now post jobs" : "Your recruiter account has been suspended",
            "/RecruiterDashboard/profile"
        )
    }

    res.json(data)
}

// GET /admin/stats  (admin only) — counts for the overview page
const getAdminStats = async(req,res)=>{
    const jobmodel = require('../model/JobSchema')

    const totalCandidates = await usermodel.countDocuments({role:"candidate"})
    const totalRecruiters = await usermodel.countDocuments({role:"recruiter"})
    const pendingRecruiters = await usermodel.countDocuments({role:"recruiter", isApproved:false})
    const liveJobs = await jobmodel.countDocuments({status:"live"})
    const pendingJobs = await jobmodel.countDocuments({status:"pending"})

    res.json({totalCandidates,totalRecruiters,pendingRecruiters,liveJobs,pendingJobs})
}

// PATCH /profile  (any logged-in user updates their own profile)
// Note: resume is NOT updated here — see uploadResume() below, it's a file upload.
const updateProfile = async(req,res)=>{
    const {headline,bio,location,skills,experience,degree,college,year,companyName} = req.body

    const data = await usermodel.findByIdAndUpdate(
        req.user.userid,
        {headline,bio,location,skills,experience,degree,college,year,companyName},
        {new:true}
    ).select("-password")

    res.json(data)
}

// POST /profile/resume  (needs authmiddle + upload.single("resume"))
const uploadResume = async(req,res)=>{
    if(!req.file){
        return res.status(400).json("koi file nahi mili")
    }

    // browser se is path pe file khul sakegi: http://localhost:6100/uploads/resumes/filename
    const resumePath = `/uploads/resumes/${req.file.filename}`

    const data = await usermodel.findByIdAndUpdate(
        req.user.userid,
        {resume: resumePath},
        {new:true}
    ).select("-password")

    res.json(data)
}

// POST /profile/photo  (needs authmiddle + photoUpload.single("photo"))
const uploadPhoto = async(req,res)=>{
    if(!req.file){
        return res.status(400).json("koi file nahi mili")
    }

    const photoPath = `/uploads/photos/${req.file.filename}`

    const data = await usermodel.findByIdAndUpdate(
        req.user.userid,
        {profilePhoto: photoPath},
        {new:true}
    ).select("-password")

    res.json(data)
}

const crypto = require('crypto')

// POST /forgot-password  body: { email }
// NOTE: no email service is wired up yet (needs an SMTP/email provider later).
// For now this returns the reset link directly in the response so you can
// test the flow — in production this link should be emailed, not returned.
const forgotPassword = async(req,res)=>{
    const {email} = req.body
    const user = await usermodel.findOne({email})

    if(!user){
        return res.json("If that email exists, a reset link has been sent")
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpiry = Date.now() + 1000*60*15   // 15 minutes
    await user.save()

    const resetLink = `http://localhost:5173/reset-password?token=${token}`

    // TODO: send `resetLink` via email once an email service (e.g. nodemailer) is set up.
    res.json({message:"If that email exists, a reset link has been sent", resetLink})
}

// POST /reset-password  body: { token, newPassword }
const resetPassword = async(req,res)=>{
    const {token,newPassword} = req.body
    const user = await usermodel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    })

    if(!user){
        return res.status(400).json("Reset link is invalid or has expired")
    }

    user.password = await bcrypt.hash(newPassword,10)
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    res.json("Password updated, you can log in now")
}

module.exports = {usersign,userlogin,getProfile,listRecruiters,approveRecruiter,updateProfile,uploadResume,uploadPhoto,getAdminStats,forgotPassword,resetPassword}