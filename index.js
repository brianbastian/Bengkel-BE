const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const chalk = require('chalk')
const fileUpload = require('express-fileupload');
const moment = require('moment-timezone');
const cron = require('node-cron');
moment.tz('Asia/Jakarta');
require('dotenv').config();

var app = express();
var url = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/', require('./routes'));

mongoose.Promise = global.Promise;
mongoose.connect(url).then(() => {
    if (process.env.PROCESS_ENV == `development`) {
        console.log(`mongoose connected ${chalk.green('✓')}`);
    }
});

const Mechanic = require("./models/mechanic");

cron.schedule("0 8 * * MON", async () => {
    await Mechanic.updateMany({}, { $set : { bonus : { monday : { date: null, total: 0 }, tuesday : { date: null, total: 0 }, wednesday : { date: null, total: 0 }, thursday : { date: null, total: 0 }, friday : { date: null, total: 0 }, saturday : { date: null, total: 0 } } } }).then(() => {
        console.log( `mechanic bonus reset successfully at ${ moment().toLocaleString() }` );
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Backend is running on http://127.0.0.1:${process.env.PORT || 3000} or http://localhost:${process.env.PORT || 3000}`)
});