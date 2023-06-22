const router = require("express").Router();
const authController = require("../../controller/authController");
const checkpermission = require("../../utilities/tokenmanager/checkpermission");
const authValidator = require("../../utilities/validations/authValidation");

router.post("/register", authValidator.register, authController.register);
router.post("/login", authValidator.login, authController.login);
router.get("/details", checkpermission, authController.details);
router.post("/details/update", checkpermission, authController.update_details);

module.exports = router;