var express = require('express');
var router = express.Router();
const queries = require('../queries');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({ title: 'Wordle API' });
});

router.get('/words/', queries.get_all_words);

module.exports = router;
