const jobmodel = require('../model/JobSchema')
const usermodel = require('../model/UserSchema')
const {createNotification} = require('./notificationcontroller')

// POST /jobs  (recruiter only, aur admin-approved hona chahiye)
const createJob = async(req,res)=>{
    const recruiter = await usermodel.findById(req.user.userid)

    if(!recruiter.isApproved){
        return res.status(403).json("Aapka recruiter account abhi admin approval ka wait kar raha hai")
    }

    const {title,company,location,type,salaryMin,salaryMax,description,skillsRequired} = req.body

    const data = await jobmodel.create({
        title,company,location,type,salaryMin,salaryMax,description,skillsRequired,
        postedBy: req.user.userid
    })

    res.json(data)
}

// GET /jobs  (public) — only "live" jobs, for candidates browsing/searching
const getJobs = async(req,res)=>{
    const data = await jobmodel.find({status:"live"}).populate("postedBy","name")
    res.json(data)
}

// GET /jobs/my  (recruiter only) — jobs posted by the logged-in recruiter
const getMyJobs = async(req,res)=>{
    const data = await jobmodel.find({postedBy:req.user.userid})
    res.json(data)
}

// GET /admin/jobs  (admin only) — all jobs, any status, for review
const getAllJobsAdmin = async(req,res)=>{
    const data = await jobmodel.find().populate("postedBy","name email")
    res.json(data)
}

// PATCH /admin/jobs/:id/status  (admin only)  body: { status: "live" | "rejected" }
const updateJobStatus = async(req,res)=>{
    const {status} = req.body
    const data = await jobmodel.findByIdAndUpdate(req.params.id, {status}, {new:true})

    if(data){
        await createNotification(
            data.postedBy,
            `Your job "${data.title}" was marked: ${status}`,
            `/RecruiterDashboard/listings`
        )
    }

    res.json(data)
}

// POST /jobs/:id/save  (candidate only) — toggle save/unsave
const toggleSaveJob = async(req,res)=>{
    const usermodel = require('../model/UserSchema')
    const user = await usermodel.findById(req.user.userid)

    const jobId = req.params.id
    const alreadySaved = user.savedJobs.includes(jobId)

    if(alreadySaved){
        user.savedJobs.pull(jobId)
    }else{
        user.savedJobs.push(jobId)
    }

    await user.save()
    res.json({savedJobs:user.savedJobs})
}

// GET /jobs/saved  (candidate only) — candidate's bookmarked jobs, full details
const getSavedJobs = async(req,res)=>{
    const usermodel = require('../model/UserSchema')
    const user = await usermodel.findById(req.user.userid).populate("savedJobs")
    res.json(user.savedJobs)
}

// GET /jobs/:id  (public) — ek job ki poori details, job-details page ke liye
const getJobById = async(req,res)=>{
    const data = await jobmodel.findById(req.params.id).populate("postedBy","name")
    res.json(data)
}

// GET /companies  (public) — distinct companies with their live-job count, for the Companies page
const getCompanies = async(req,res)=>{
    const data = await jobmodel.aggregate([
        { $match: { status: "live" } },
        { $group: {
            _id: "$company",
            openRoles: { $sum: 1 },
            location: { $first: "$location" }
        }},
        { $sort: { openRoles: -1 } }
    ])

    res.json(data)
}

// PATCH /jobs/:id  (recruiter only, must own the job)
const updateJob = async(req,res)=>{
    const job = await jobmodel.findById(req.params.id)

    if(!job){
        return res.status(404).json("job not found")
    }
    if(job.postedBy.toString() !== req.user.userid){
        return res.status(403).json("you can only edit your own jobs")
    }

    const {title,company,location,type,salaryMin,salaryMax,description,skillsRequired} = req.body

    // job edit hone ke baad dobara admin review mein jaani chahiye
    const data = await jobmodel.findByIdAndUpdate(
        req.params.id,
        {title,company,location,type,salaryMin,salaryMax,description,skillsRequired,status:"pending"},
        {new:true}
    )

    res.json(data)
}

// DELETE /jobs/:id  (recruiter only, must own the job)
const deleteJob = async(req,res)=>{
    const job = await jobmodel.findById(req.params.id)

    if(!job){
        return res.status(404).json("job not found")
    }
    if(job.postedBy.toString() !== req.user.userid){
        return res.status(403).json("you can only delete your own jobs")
    }

    await jobmodel.findByIdAndDelete(req.params.id)
    res.json("job deleted")
}

module.exports = {createJob,getJobs,getMyJobs,getAllJobsAdmin,updateJobStatus,toggleSaveJob,getSavedJobs,getJobById,getCompanies,updateJob,deleteJob}
