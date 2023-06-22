const router = require("express").Router();
const authController = require("../../controller/authController");
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");
const authValidator = require("../../utilities/validations/authValidation");

router.post("/register", authValidator.register, authController.register);
router.post("/login", authValidator.login, authController.login);
router.post("/details", checkUserToken, authController.details);
router.post("/details/update", checkUserToken, authController.update_details);

module.exports = router;
