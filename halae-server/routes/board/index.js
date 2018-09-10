const express = require('express');
const router = express.Router();

router.use('/', require('./board.js'));
router.use('/list', require('./list.js'));
router.use('/comment', require('./comment.js'));

module.exports = router;