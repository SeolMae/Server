const express = require('express');
const router = express.Router();

// info (할머니 정보 보기 & 정보 수정하기)
router.use('/info', require('./info'));

// schedule 할머니 스케쥴 보기 
router.use('/schedule', require('./schedule'));

// board 할머니 게시글 보기 
router.use('/board', require('./board'));

// filter 할머니 검색 필터링 
router.use('/filter', require('./filter'));

module.exports = router;