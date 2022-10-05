const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/route.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/authAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the Database successfully')
})

app.use(express.json())
app.use('/', routes);
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Running at localhost:${PORT}`)
    })
}

module.exports = app;