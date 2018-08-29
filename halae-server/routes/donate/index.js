const express = require('express');
const router = express.Router();

// list 기부하기 리스트 
router.use('/list', require('./list'));

// detail 기부글 상세보기 
router.use('/detail', require('./detail'));


module.exports = router;