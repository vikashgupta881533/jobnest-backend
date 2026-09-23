const applicationmodel = require('../model/ApplicationSchema')
const jobmodel = require('../model/JobSchema')
const {createNotification} = require('./notificationcontroller')

// POST /applications  (candidate only)  body: { jobId }
const applyToJob = async(req,res)=>{
    const {jobId} = req.body

    const already = await applicationmodel.findOne({job:jobId, candidate:req.user.userid})
    if(already){
        return res.json("already applied to this job")
    }

    const data = await applicationmodel.create({
        job: jobId,
        candidate: req.user.userid
    })

    // recruiter ko batao ki naya applicant aaya
    const job = await jobmodel.findById(jobId)
    if(job){
        await createNotification(job.postedBy, `New applicant for "${job.title}"`, `/RecruiterDashboard/applicants/${jobId}`)
    }

    res.json(data)
}

// GET /applications/my  (candidate only) — candidate's own application status list
const getMyApplications = async(req,res)=>{
    const data = await applicationmodel.find({candidate:req.user.userid})
        .populate("job", "title company")
    res.json(data)
}

// GET /applications/job/:jobId  (recruiter only) — everyone who applied to one of their jobs
const getApplicationsForJob = async(req,res)=>{
    const data = await applicationmodel.find({job:req.params.jobId})
        .populate("candidate", "name email skills experience")
    res.json(data)
}

// PATCH /applications/:id/status  (recruiter only)
// body: { status: "shortlisted" | "interview" | "offer" | "rejected" | "hired" }
const updateApplicationStatus = async(req,res)=>{
    const {status} = req.body
    const data = await applicationmodel.findByIdAndUpdate(req.params.id, {status}, {new:true})
        .populate("job","title")

    if(data){
        await createNotification(
            data.candidate,
            `Your application for "${data.job.title}" is now: ${status}`,
            `/CandidateDashboard/applications`
        )
    }

    res.json(data)
}

// GET /applications/recruiter  (recruiter only) — sab applications, sabhi apne jobs ke across
// (Overview stats, Pipeline, aur Messages page — teeno isi ek API se kaam chala lete hain)
const getApplicationsForRecruiter = async(req,res)=>{
    const myJobs = await jobmodel.find({postedBy:req.user.userid}).select("_id")
    const jobIds = myJobs.map((j)=>j._id)

    const data = await applicationmodel.find({job:{$in:jobIds}})
        .populate("job","title company")
        .populate("candidate","name email skills experience")
        .sort({createdAt:-1})

    res.json(data)
}

module.exports = {applyToJob,getMyApplications,getApplicationsForJob,updateApplicationStatus,getApplicationsForRecruiter}
