const express = require('express');
const app = express();
const port = 3030;

app.get('/', (req, res) => {
    res.send({ response: 'Way to go, chief.' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
