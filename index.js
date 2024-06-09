const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.json());

const destinasi = require("../backend/routers/wisata");
const users = require('../backend/routers/users');

app.use('/api/users', users);
app.use('/uploads', express.static('uploads'));
app.use("/destinasi", destinasi);

app.get('/', (req, res) => {
    res.send('API Ready To GO!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
