const router = require('express').Router();
const accountController = require("./../controllers/account");

// POST api/account/register
router.post("/register", accountController.registerAPI);
// POST api/account/login
router.post("/login", accountController.loginAPI);

module.exports = router;