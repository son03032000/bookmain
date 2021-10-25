const express = require("express"),
router = express.Router();
var book_controller = require('../controllers/book');
const middleware = require("../middleWare/check")

/* GET request for list of all Book items. */
router.get('/books/:filter/:value/:page', book_controller.book_list);

router.post('/books/:filter/:value/:page', book_controller.findBooks)
/* GET request for one Book. */
router.get('/books/details/:book_id',middleware.isLoggedIn, book_controller.book_detail);




module.exports = router;