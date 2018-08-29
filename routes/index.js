var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// auth
router.use('/auth', require('./auth/index'));

//halmae
router.use('search', require('./search/index'));

// board
router.use('/board', require('./board/index'));

// donate
router.use('/donate', require('./donate/index'));

// mypage
router.use('/mypage', require('./mypage/index'));

module.exports = router;
