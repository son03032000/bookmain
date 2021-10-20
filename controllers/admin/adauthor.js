var Book = require("../../models/book");
var Author = require("../../models/author");
var async = require("async");
var { body, validationResult } = require("express-validator/check");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "sstt",
  api_key: 878854271598434,
  api_secret: "UyilBk07KLomikO5mafQJdDt-zw",
});
// Hiển thị Tác giả tạo biểu mẫu on GET
exports.author_create_get = (req, res) => {
  const authors = Author.find();
  res.render("admin/author/author_form", { title: "Create Author", authors });
};

// Xử lý Tác giả tạo on POST
exports.author_create_post = async (req, res) => {
  req.checkBody("first_name", "First name must be specified.").notEmpty(); //Chúng tôi sẽ không ép buộc chữ và số, vì mọi người có thể có khoảng trắng.
  req.checkBody("last_name", "last name must be specified.").notEmpty();
  req
    .checkBody("last_name", "last name must be Alphanumeric.")
    .isAlphanumeric();

  var errors = req.validationErrors();
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  var author = new Author({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    date_of_death: req.body.date_of_death,
    describe: req.body.describe,
    ImageUrl: result.secure_url,
  });

  if (errors) {
    res.render("admin/author/author_form", {
      title: "Create Author",
      author: author,
      errors: errors,
    });
    return;
  } else {
    //Dữ liệu từ biểu mẫu là hợp lệ

    author.save(function (err) {
      if (err) {
        return next(err);
      }
      //successful - redirect to new author record.
      res.redirect("/authors/all/all/1");
    });
  }
};

// Display Author delete form on GET
exports.author_delete_get = function (req, res, next) {
  async.parallel(
    {
      author: function (data) {
        Author.findById(req.params.id).exec(data);
      },
      authors_books: function (data) {
        Book.find({ author: req.params.id }).exec(data);
      },
    },
    function (err, data) {
      if (err) {
        return next(err);
      }
      if (data.author == null) {
        // No data.
        res.redirect("/authors/all/all/1");
      }
      //Successful, so render
      res.render("admin/author/author_delete", {
        title: "Delete Author",
        author: data.author,
        author_books: data.authors_books,
      });
    }
  );
};

// Handle Author delete on POST
exports.author_delete_post = function (req, res) {
  req.checkBody("authorid", "Author id must exist").notEmpty();

  async.parallel(
    {
      author: function (data) {
        Author.findById(req.body.authorid).exec(data);
      },
      authors_books: function (data) {
        Book.find({ author: req.body.authorid }).exec(data);
      },
    },
    function (err, data) {
      if (err) {
        return next(err);
      }
      // Success
      if (data.authors_books.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("admin/author/author_delete", {
          title: "Delete Author",
          author: data.author,
          author_books: data.authors_books,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/authors/all/all/1");
        });
      }
    }
  );
};

// Display Author update form on GET
exports.author_update_get = function (req, res) {
  Author.findById(req.params.author_id, function (err, author) {
    if (err) {
      return next(err);
    }
    if (author == null) {
      var err = new Error("Author not found");
      err.status = 404;
      return next(err);
    }
    res.render("admin/author/author_update", {
      title: "Update Author",
      author: author,
    });
  });
};

// Handle Author update on POST
exports.author_update_post = [
  // Validate fields.
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601(),

  async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    var author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      describe: req.body.describe,
      ImageUrl: result.secure_url,
      _id: req.params.author_id,
    });
    // Data from form is valid. Update the record.
    Author.findByIdAndUpdate(req.params.author_id, author);
    // Successful - redirect to genre detail page.
    res.redirect("/admin/authorInventory/all/all/1");
  },
];
