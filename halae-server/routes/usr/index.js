const express = require('express');
const router = express.Router();

router.use('/', require('./usr.js'));
router.use('/halmae', require('./usrhalmae.js'));
router.use('/schedule', require('./usrschedule.js'));
router.use('/volunteer', require('./usrvolunteer.js'));
router.use('/board', require('./usrboard.js'));
router.use('/donate', require('./usrdonate.js'));

module.exports = router;