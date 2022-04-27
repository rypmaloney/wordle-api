var express = require('express');
var router = express.Router();
const queries = require('../queries');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({ title: 'Wordle API' });
});
router.get('/list/:id', queries.get_list);

router.get('/words/', queries.get_all_words);

router.post('/words/:id', queries.add_word);

router.get('/words/:id', queries.get_individual_word);

router.get('/test/', (req, res) => {
    res.json({ message: 'API operational. Retesting...' });
});

module.exports = router;
