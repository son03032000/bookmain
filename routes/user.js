const router = require("express").Router();
const upload = require('../handlers/upload.multer')
var user_controller = require('../controllers/user')


router.get("/user/:page",user_controller.getUserDashboard )
//user -> profile
router.get('/user/:page/profile',user_controller.getUserProfile);
//upload image
router.post("/user/1/image", user_controller.postUploadUserImage)
// update Pass
router.put("/user/1/update-password",user_controller.putUpdatePassword)
// update profile
router.put("/user/1/update-profile",user_controller.putUpdateUserProfile)
// Xóa acc
router.delete("/user/1/delete-profile", user_controller.deleteUserAccount)

//create New Cmt
router.post("/books/details/:book_id/comment", user_controller.postNewComment)
//user -> update existing comment
router.post("/books/details/:book_id/:comment_id", user_controller.postUpdateComment);

//user -> delete existing comment
router.delete("/books/details/:book_id/:comment_id",  user_controller.deleteComment);

// get create new postrv
router.get("/books/details/:book_id/postrv",user_controller.getNewPost)
//create New postrv
router.post("/books/details/:book_id/postrv", user_controller.postNewPost)
//get postrv update
router.get("/books/details/:book_id/:postrv_id", user_controller.getUpdatePost)
//Update postrv
router.post("/books/details/:book_id/:postrv_id", user_controller.postUpdatePost)
// xóa postrv
router.delete("/books/details/:book_id/:postrv_id", user_controller.deletePost)

module.exports = router;



module.exports = router;