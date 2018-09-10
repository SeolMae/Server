const express = require('express');
const router = express.Router();


router.use('/don', require('./donate.js'));
router.use('/hal', require('./halmate.js'));
router.use('/vol', require('./volunteer.js'));

module.exports = router;