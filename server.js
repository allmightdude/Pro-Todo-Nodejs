const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
// const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({path : './config/config.env'});

// const {decode} = require('./middlewares/jwt');
const {verifyToken} = require('./middlewares/authJwt');

const app = express();

app.use(cors());
// app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// get routes
app.use('/users' , require('./routes/user'));
app.use('/tasks' , verifyToken , require('./routes/task'));
app.use('/plans' , verifyToken , require('./routes/plan'));

connectDB();
const PORT = process.env.PORT || 3000;

app.listen(3000 , ()=>{
    console.log(`server runing on ${PORT}`);
})