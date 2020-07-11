const express = require('express');

require('./mongoose');
const {autheticateToken} = require('./auth/authMiddlewares');

const app = express();

app.listen(3000);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Unauthorized Routes starts
const authRoute = require('./auth/authRoute');

app.use('/auth',authRoute);

//end

app.use(autheticateToken);

//Authorized Routes start
const studentRoute = require('./features/Student/studentRoute');

app.use('/student',studentRoute);