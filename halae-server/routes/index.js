var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// auth
router.use('/auth', require('./auth/index'));

//halmae
router.use('/halmae', require('./halmae/index'));

// board
router.use('/board', require('./board/index'));

// donate
router.use('/donate', require('./donate/index'));

// usr
router.use('/usr', require('./usr/index'));

// recommend
router.use('/recommend', require('./recommend/index'));

module.exports = router;
