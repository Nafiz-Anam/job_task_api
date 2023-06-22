const router = require("express").Router();
const UserRouter = require("./UserRoute/UserRouter");
const CourseRouter = require("./CourseRouter/CourseRouter");
const DashboardRouter = require("./DashboardRouter/DashboardRouter");


router.use("/user", UserRouter);
router.use("/course", CourseRouter);
router.use("/dashboard", DashboardRouter);



module.exports = router;
