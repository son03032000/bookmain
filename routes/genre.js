var express = require('express');
var router = express.Router();

var genre_controller = require('../controllers/genre');
const middleware = require("../middleWare/check")


/* GET request for list of all Genre. */
router.get('/genres/:filter/:value/:page', genre_controller.genre_list);

router.post('/genres/:filter/:value/:page',genre_controller.FindGenres)
/* GET request for one Genre. */
router.get('/genres/details/:genre_id', genre_controller.genre_detail);


module.exports = router;