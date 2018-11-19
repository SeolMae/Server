const express = require('express');
const router = express.Router();

// kakaologin
router.use('/', require('./kakaologin.js'));
router.use('/register', require('./register.js'));

module.exports = router;