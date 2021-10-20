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

router.get("/users/activities/:user_id",middleware.isLoggedIn,user_controller.getUserAllActivities)
router.post("/users/activities/:user_id",middleware.isLoggedIn,user_controller.postShowActivitiesByCategory)


//user -> issue a book
router.post("/books/:book_id/like/:user_id", middleware.isLoggedIn, user_controller.postLikeBook);

//user -> show favorite
router.get("/books/favorite", middleware.isLoggedIn, user_controller.getShowFavorite);
// user -> dislike book

router.post("/books/:book_id/dislike", middleware.isLoggedIn, user_controller.postDislikeBook);


module.exports = router;