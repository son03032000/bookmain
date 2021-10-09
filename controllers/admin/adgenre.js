var Book = require("../../models/book");
var Genre = require("../../models/genre");
var async = require("async");
var { body, validationResult } = require("express-validator/check");

// Display Genre create form on GET
exports.genre_create_get = function (req, res, next) {
  res.render("admin/genre/genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST
exports.genre_create_post = function (req, res, next) {
  //Check that the name field is not empty
  req.checkBody("name", "Genre name required").notEmpty();

  //Run the validators
  var errors = req.validationErrors();

  //Create a genre object with escaped and trimmed data.
  var genre = new Genre({ name: req.body.name });

  if (errors) {
    //If there are errors render the form again, passing the previously values and errors
    res.render("admin/genre/genre_form", {
      title: "Create Genre",
      genre: genre,
      errors: errors,
    });
    return;
  } else {
    //Data from form is valid.
    //Check if Genre with same name already exists
    Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
      console.log("found_genre: " + found_genre);
      if (err) {
        return next(err);
      }

      if (found_genre) {
        //Genre exists, redirect to its detail page
        res.redirect(found_genre.url);
      } else {
        genre.save(function (err) {
          if (err) {
            return next(err);
          }
          //Genre saved. redirect to genre detail page
          res.redirect("/genres/all/all/1");
        });
      }
    });
  }
};

// Display Genre delete form on GET
exports.genre_delete_get = function (req, res, next) {
  async.parallel(
    {
      genre: function (data) {
        Genre.findById(req.params.id).exec(data);
      },
      genre_books: function (data) {
        Book.find({ genre: req.params.id }).exec(data);
      },
    },
    function (err, data) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("admin/genre/genre_delete", {
        title: "Delete Genre",
        genre: data.genre,
        genre_books: data.genre_books,
      });
    }
  );
};

// Handle Genre delete on POST
exports.genre_delete_post = function (req, res, next) {
  req.checkBody("genreid", "Genre id must exist").notEmpty();

  async.parallel(
    {
      genre: function (data) {
        Genre.findById(req.body.genreid).exec(data);
      },
      genre_books: function (data) {
        Book.find({ genre: req.body.genreid }, "title summary").exec(data);
      },
    },
    function (err, data) {
      if (err) {
        return next(err);
      }
      //Successful
      if (data.genre_books.length > 0) {
        //genre has books. Render in same way as for GET route.
        res.render("admin/genre/genre_delete", {
          title: "Delete Genre",
          genre: data.genre,
          genre_books: data.genre_books,
        });
        return;
      } else {
        //Genre has no books. Delete object and direct to view page
        Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
          if (err) {
            return next(err);
          }
          //Successful, dirent to genre views
          res.redirect("/genres/all/all/1");
        });
      }
    }
  );
};

// Display Genre update form on GET
exports.genre_update_get = function (req, res) {
  Genre.findById(req.params.genre_id, function (err, genre) {
    if (err) {
      return next(err);
    }
    if (genre == null) {
      // No results.
      var err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("admin/genre/genre_update", {
      title: "Update Genre",
      genre: genre,
    });
  });
};

// Handle Genre update on POST
exports.genre_update_post = [
  // Validate that the name field is not empty.
  body("name", "Genre name required").isLength({ min: 1 }).trim(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
    var genre = new Genre({
      name: req.body.name,
      _id: req.params.genre_id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("admin/genre/genre_update", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Genre.findByIdAndUpdate(
        req.params.genre_id,
        genre,
        {},
        function (err, thegenre) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to genre detail page.
          res.redirect("/admin/genreInventory/all/all/1");
        }
      );
    }
  },
];
