const messagemodel = require('../model/MessageSchema')
const applicationmodel = require('../model/ApplicationSchema')
const jobmodel = require('../model/JobSchema')
const {createNotification} = require('./notificationcontroller')

// POST /messages   body: { applicationId, text }
const sendMessage = async(req,res)=>{
    const {applicationId,text} = req.body

    const data = await messagemodel.create({
        application: applicationId,
        sender: req.user.userid,
        text
    })

    // dusri party ko batao — candidate ne bheja to recruiter ko, recruiter ne bheja to candidate ko
    const application = await applicationmodel.findById(applicationId).populate("job")
    if(application){
        const isSenderCandidate = application.candidate.toString() === req.user.userid
        const recipientId = isSenderCandidate ? application.job.postedBy : application.candidate
        const link = isSenderCandidate
            ? `/RecruiterDashboard/messages`
            : `/CandidateDashboard/applications`

        await createNotification(recipientId, "You have a new message", link)
    }

    res.json(data)
}

// GET /messages/:applicationId
const getMessages = async(req,res)=>{
    const data = await messagemodel.find({application:req.params.applicationId})
        .populate("sender","name role")
        .sort({createdAt:1})

    res.json(data)
}

module.exports = {sendMessage,getMessages}
