const router = require("express").Router();
const courseController = require("../../controller/courseController");
const course_uploader = require("../../uploads/course_uploder");
const checkTeacherToken = require("../../utilities/tokenmanager/checkAdminToken");
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");
const authValidator = require("../../utilities/validations/authValidation");

router.post("/create", checkTeacherToken, course_uploader, courseController.create);
router.post("/list", courseController.list);
router.post("/details", courseController.details);
router.post("/comment/add", checkUserToken, courseController.review_add);


module.exports = router;
