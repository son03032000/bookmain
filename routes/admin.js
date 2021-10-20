var express = require('express');
var router = express.Router();
const upload = require('../handlers/upload.multer')
// Require controller modules
var book_controller = require('../controllers/admin/adbook');
var author_controller = require('../controllers/admin/adauthor');
var genre_controller = require('../controllers/admin/adgenre');
var admin_controller = require('../controllers/admin/admin')
const middleware = require("../middleWare/check")

//admin-> dashborad
router.get("/",middleware.isLoggedIn,middleware.isAdmin, admin_controller.getDashboard)
//admin book inventory
router.get("/bookInventory/:filter/:value/:page",middleware.isLoggedIn,middleware.isAdmin, admin_controller.getAdminBookInventory)
router.post("/bookInventory/:filter/:value/:page",middleware.isLoggedIn,middleware.isAdmin,admin_controller.postAdminBookInventory)

router.get("/authorInventory/:filter/:value/:page",middleware.isLoggedIn,middleware.isAdmin,admin_controller.getAdminAuthorInventory)
router.post("/authorInventory/:filter/:value/:page",middleware.isLoggedIn,middleware.isAdmin,admin_controller.postAdminAuthorInventory)

router.get("/genreInventory/:filter/:value/:page",middleware.isLoggedIn,middleware.isAdmin,admin_controller.getAdminGenreInventory)
router.post("/genreInventory/:filter/:value/:page",middleware.isLoggedIn,middleware.isAdmin,admin_controller.postAdminGenreInventory)

//ad-> profile
router.get('/profile',middleware.isLoggedIn,middleware.isAdmin,admin_controller.getAdminProfile);
//update profile
router.post("/update-profile",middleware.isLoggedIn,middleware.isAdmin,admin_controller.postUpdateAdminProfile)
//update password
router.put("/update-password",middleware.isLoggedIn,middleware.isAdmin,admin_controller.putUpdatePassword)
// delete profile
router.delete("/delete-profile",middleware.isLoggedIn,middleware.isAdmin, admin_controller.deleteAdminProfile)
// user list
router.get("/users/:page", middleware.isLoggedIn,middleware.isAdmin,admin_controller.user_list);
//show one user
router.get("/users/profile/:user_id",middleware.isLoggedIn,middleware.isAdmin,admin_controller.getUserProfile)
//delete a user
router.get("/users/delete/:user_id",middleware.isLoggedIn,middleware.isAdmin, admin_controller.getDeleteUser);
//show searched user
router.post("/users/:page",middleware.isLoggedIn,middleware.isAdmin,admin_controller.postShowSearchedUser )
router.get("/users/activities/:user_id",middleware.isLoggedIn,middleware.isAdmin,admin_controller.getUserAllActivities)
router.post("/users/activities/:user_id",middleware.isLoggedIn,middleware.isAdmin,admin_controller.postShowActivitiesByCategory)






/// BOOK ROUTES ///

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
router.get('/books/add', book_controller.book_create_get);
/* POST request for creating Book. */
router.post('/books/add',upload.single('image'), book_controller.book_create_post);
/* GET request to delete Book. */

router.get('/book/delete/:id',book_controller.book_delete_get);

/* GET request to update Book. */
router.get('/book/update/:book_id', book_controller.book_update_get);
// POST request to update Book
router.post('/book/update/:book_id',upload.single('image'), book_controller.book_update_post);



/// AUTHOR ROUTES ///


/* GET request for creating Author. NOTE This must come before route for id (i.e. display author) */
router.get('/authors/add', author_controller.author_create_get);
/* POST request for creating Author. */
router.post('/authors/add',upload.single('image'),author_controller.author_create_post);
/* GET request to delete Author. */
router.get('/author/delete/:id',author_controller.author_delete_get);
// POST request to delete Author
router.post('/author/delete/:id', author_controller.author_delete_post);
/* GET request to update Author. */
router.get('/author/update/:author_id', author_controller.author_update_get);
// POST request to update Author
router.post('/author/update/:author_id',upload.single('image'), author_controller.author_update_post);





/// GENRE ROUTES ///

/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/genres/add', genre_controller.genre_create_get);
/* POST request for creating Genre. */
router.post('/genres/add',upload.single('image'), genre_controller.genre_create_post);
/* GET request to delete Genre. */
router.get('/genre/delete/:id', genre_controller.genre_delete_get);
// POST request to delete Genre
router.post('/genre/delete/:id', genre_controller.genre_delete_post);
/* GET request to update Genre. */
router.get('/genre/update/:genre_id', genre_controller.genre_update_get);
// POST request to update Genre
router.post('/genre/update/:genre_id',upload.single('image'), genre_controller.genre_update_post);






module.exports = router;
