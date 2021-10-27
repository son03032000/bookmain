var express = require('express');
var router = express.Router();
const passport = require("passport")


// Import index controller
const authController = require('../controllers/auth');

// Import models

router.get('/',authController.getHome)
//landing page

//admin logout handler
router.get("/auth/admin-logout", authController.getAdminLogout);


// admin sign up handler
router.get("/auth/admin-signup", authController.getAdminSignUp);

router.post("/auth/admin-signup", authController.postAdminSignUp);

//user login handler
router.get("/auth/user-login", authController.getUserLoginPage);


router.post('/auth/user-login',passport.authenticate('local', {
          failureRedirect: '/auth/user-login'
        }), (req, res) => {
          if (req.user.isAdmin === true) {
            res.redirect('/admin');
          }
          if (req.user.isAdmin === false) {
            res.redirect('/user/1');
          }
        });

//user -> user logout handler
router.get("/auth/user-logout", authController.getUserLogout);

//user sign up handler
router.get("/auth/user-signUp", authController.getUserSignUp);

router.post("/auth/user-signup", authController.postUserSignUp);

module.exports = router;