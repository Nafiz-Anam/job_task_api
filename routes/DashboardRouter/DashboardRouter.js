const router = require("express").Router();
const dashboardController = require("../../controller/dashboardController");
const course_uploader = require("../../uploads/course_uploder");
const checkTeacherToken = require("../../utilities/tokenmanager/checkAdminToken");
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");
const checkpermission = require("../../utilities/tokenmanager/checkpermission");
const authValidator = require("../../utilities/validations/authValidation");


router.post("/statics", checkpermission, dashboardController.list);
router.post("/chart",  dashboardController.progress);



module.exports = router;
