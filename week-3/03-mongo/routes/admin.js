const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();


// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username : username,
        password : password,
    })

    res.json({
        message: 'Admin created Succesfully'
    })
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imagelink = req.body.imageLink;
    const price = req.body.price;

    const newCourse = await Course.create({
        title : title,
        description : description,
        imageLink : imagelink,
        price : price
    })

    res.json({
        message : "course Added",
        courseId : newCourse._id
    })

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});
    res.json({
        courses
    })
});

module.exports = router;