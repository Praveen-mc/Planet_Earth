const express = require('express');
const mapController = require('./controllers/mapController');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('views'));

app.get('/', mapController.renderMap);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
