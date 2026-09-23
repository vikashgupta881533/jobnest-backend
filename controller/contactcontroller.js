const contactmodel = require('../model/ContactSchema')

// POST /contact  (public, no login needed)
const submitContact = async(req,res)=>{
    const {name,email,message} = req.body

    await contactmodel.create({name,email,message})

    res.json("Message sent")
}

module.exports = {submitContact}
