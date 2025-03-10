const express = require('express')
const app = express()
const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
//require dotenv to use feature from env file from anywhere
const dotenv = require('dotenv')
dotenv.config();

const connectToDB = require('./config/db')
connectToDB();

const cookieParser = require('cookie-parser')

app.set("view engine", "ejs"); //to set up ejs

//call middleware cookie parser
app.use(cookieParser());

//below are to encode the req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//we have to make route files independently for all bz it will confuse a lot if we do it in app.js\

app.use('/', indexRouter);
app.use('/user', userRouter);


app.listen(3001, () => {
    console.log("server is running on port 3001");
});