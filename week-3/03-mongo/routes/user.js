const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username,
        password
    })
    res.json({
        message: "user created"
    })
    
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses =await Course.find({});
    res.json({
        courses
    })
    
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;
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
    const username = req.headers.username;
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