const router = require('./router');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router);

const port = process.env.PORT || 5555;

app.listen(port, () => console.log(`Listening on port: ${port}`));