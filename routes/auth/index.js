const express = require('express');
const router = express.Router();

// kakaologin
router.use('/kakaologin', require('./kakaologin'));

module.exports = router;