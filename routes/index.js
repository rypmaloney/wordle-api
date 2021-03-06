var express = require('express');
var router = express.Router();
const queries = require('../queries');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({ title: 'Wordle API' });
});
router.get('/list/:id', queries.get_list);

router.get('/words/', queries.get_all_words);

router.post('/words/:id', queries.check_individual_word);

router.post('/words/:id/add', queries.add_word);

router.get('/test/', (req, res) => {
    res.json({ message: 'API operational. Retesting...' });
});

router.post('/game/', queries.post_game);

module.exports = router;
