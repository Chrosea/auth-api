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

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()) // 设置后可以用 req.body 获取 POST 传入 data
// app.use((async (req, res, next) => {
//     if (req.headers['x-access-token']) {
//         const accessToken = req.headers['x-access-token'];
//         const userId = await auth(accessToken);
//         res.locals.loggedInUser = await User.findById(userId);
//         next();
//     } else {
//         next();
//     }
// }));
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Running at localhost:${PORT}`)
})