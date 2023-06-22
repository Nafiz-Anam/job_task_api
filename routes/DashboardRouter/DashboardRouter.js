const router = require("express").Router();
const dashboardController = require("../../controller/dashboardController");
const checkpermission = require("../../utilities/tokenmanager/checkpermission");
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");


router.post("/statics", checkpermission, dashboardController.list);
router.post("/chart", checkUserToken, dashboardController.progress);



module.exports = router;
