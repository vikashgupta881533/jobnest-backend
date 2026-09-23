const {submitContact} = require('../controller/contactcontroller')

const express = require('express');
const router = express.Router();

router.post('/contact', submitContact)

module.exports = router
