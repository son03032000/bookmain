const router = require("express").Router();
const upload = require('../handlers/upload.multer')

var user_controller = require('../controllers/user')
const middleware = require("../middleWare/check")

router.get("/user/:page",middleware.isLoggedIn,user_controller.getUserDashboard )
//user -> profile
router.get('/user/:page/profile',middleware.isLoggedIn,user_controller.getUserProfile);
//upload image
router.post("/user/1/image",middleware.isLoggedIn,upload.single('image'), user_controller.postUploadUserImage)
// update Pass
router.put("/user/1/update-password",middleware.isLoggedIn,user_controller.putUpdatePassword)
// update profile
router.put("/user/1/update-profile",middleware.isLoggedIn,user_controller.putUpdateUserProfile)
// Xóa acc
router.delete("/user/1/delete-profile",middleware.isLoggedIn, user_controller.deleteUserAccount)
router.get("/users/profile/:user_id",middleware.isLoggedIn,user_controller.getUserProfile1)

//create New Cmt
router.post("/books/details/:book_id/comment", middleware.isLoggedIn,user_controller.postNewComment)
//user -> update existing comment
router.post("/books/details/:book_id/:comment_id", middleware.isLoggedIn,user_controller.postUpdateComment);

//user -> delete existing comment
router.delete("/books/details/:book_id/:comment_id",middleware.isLoggedIn,  user_controller.deleteComment);

// get create new postrv
router.get("/books/details/:book_id/postrv",middleware.isLoggedIn,user_controller.getNewPost)
//create New postrv
router.post("/books/details/:book_id/postrv",middleware.isLoggedIn, user_controller.postNewPost)
//get postrv update
router.get("/books/details/:book_id/:postrv_id",middleware.isLoggedIn, user_controller.getUpdatePost)
//Update postrv
router.post("/books/details/:book_id/:postrv_id",middleware.isLoggedIn, user_controller.postUpdatePost)
// xóa postrv
router.delete("/books/details/:book_id/:postrv_id", middleware.isLoggedIn,user_controller.deletePost)

router.get("/users/activities/:user_id",middleware.isLoggedIn,user_controller.getUserAllActivities)
router.post("/users/activities/:user_id",middleware.isLoggedIn,user_controller.postShowActivitiesByCategory)


module.exports = router;



module.exports = router;