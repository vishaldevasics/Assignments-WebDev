const { Router } = require("express");
const jwt = require('jsonwebtoken')
const router = Router();
const userMiddleware = require("../middleware/user");
const {User,Course} = require('../db')
const {JWT_SECRET} = require('../config')

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username : username,
        password : password,
    })

    res.json({
        message: 'User created Succesfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const isValidated = await User.findOne({
    username : username,
    password : password
    })

    if(!isValidated){
        res.status(411).json({
            msg : "Invalid credentials"
        })
        return;
    }

    const token = jwt.sign({
        username : username
    }, JWT_SECRET);

    res.json({
        token
    })
});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({});
    res.json({
        courses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const decoded = jwt.decode(jwtToken);
    const username = decoded.username;
    
    await User.updateOne({
        username:username
    },{
        "$push":{
            purchasedCourses : courseId
        }
    })
    res.json({
        message : "course purchased"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const decoded = jwt.decode(jwtToken);
    const username = decoded.username; 
    const logedUser = await User.findOne({
        username : username
    })

    const purchasedCourses = await Course.find({
        _id:{
            "$in" : logedUser.purchasedCourses
        }
    })

    res.json({
        purchasedCourses
    })
    
});

module.exports = router