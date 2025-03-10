const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')

const userModel = require('../models/user.model')

//now to protect the password use bcrypt
const bcrypt = require('bcrypt')

//for token generation
const jwt = require('jsonwebtoken')

//below route becomes '/user/test'
// router.get('/test', (req, res) => {
//     res.send('user Test route');
// })


// now yaha pe register route create krna hai
// so yaha two route create honge in first form dikha raha honge  -> get route (to show the form)
// and other is for data server pe leke user ko actual mein register kara rahe honge -> post route (to actually data server pe leke jana hai)


// <----------------------register routes------------------->
router.get('/register', (req, res) => {   //this route to get the data from frontend
    res.render('register');
})

//this route is to post the data to server without showing it in url
router.post('/register',
    //now making input fields valid using middlewares
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),

    async (req, res) => {

        //now actual data sahi hai kya nhi ye validationResult se check kro
        const errors = validationResult(req);
        // console.log(errors);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            })
        }
        // res.send(errors);

        //agar sb thik hai to req.body se nikal lo

        const { email, username, password } = req.body;

        //now use bcrypt to hash pass
        const hashPassword = await bcrypt.hash(password, 10);

        //now create new user with below properties
        const newUser = await userModel.create({
            email,
            username,
            password: hashPassword
        })
        //now return data in json format (json is used to transfer data bwn server to server)
        res.redirect('/user/login');


        // console.log(req.body);
        // res.send("register successfully");
    })


// <---------------------------login routes---------------------->
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login',
    // using express validator here
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),

    //now finally controller
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            })
        }

        const { username, password } = req.body;

        //now find that user upon login
        const user = await userModel.findOne({
            username: username
        })

        //if user not found then
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect username or password'
            })
        }

        //now if username is matched then compare pass with help of bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        //if pass is not matched then
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect username or password',
            })
        }


        //now if we have matched pass then now we have to generate token with use of jsonwebtoken

        //token is used to understand that user has been already logged in and now he can perform any operation until he logged off

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        },
            process.env.JWT_SECRET,
        )

        // res.json({
        //     token     // it will show token on browser
        // })

        res.cookie('token', token);  //('name to given', actual token)

        res.redirect('/home');
        //now this token is used to remain authorize while logged in 

        //but we use cookies to save the token which help in session and etc


    })

module.exports = router;