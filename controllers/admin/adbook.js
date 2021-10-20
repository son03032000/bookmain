var Book = require("../../models/book");
var Author = require("../../models/author");
var Genre = require("../../models/genre");
const cloudinary = require("cloudinary");
var async = require("async");
var { body, validationResult } = require("express-validator/check");
// Setup Cloudinary
cloudinary.config({
  cloud_name: "sstt",
  api_key: 878854271598434,
  api_secret: "UyilBk07KLomikO5mafQJdDt-zw",
});

// Hiển thị biểu mẫu tạo sách trên GET
exports.book_create_get = function (req, res, next) {
  //Nhận tất cả các tác giả và thể loại mà chúng tôi có thể sử dụng để thêm vào sách của mình.
  async.parallel(
    {
      authors: function (data) {
        Author.find(data);
      },
      genres: function (data) {
        Genre.find(data);
      },
    },
    function (err, data) {
      if (err) {
        return next(err);
      }
      res.render("admin/book/book_form", {
        title: "Create Book",
        authors: data.authors,
        genres: data.genres,
      });
    }
  );
};

exports.book_create_post = async (req, res, next) => {
  try {
    req.checkBody("title", "Title must not be empty.").notEmpty(); //Tiêu đề không được để trống.
    req.checkBody("author", "Author must not be empty").notEmpty();
    req.checkBody("summary", "Summary must not be empty").notEmpty();
    req.checkBody("describe", "describe must not be empty").notEmpty();


    const result = await cloudinary.v2.uploader.upload(req.file.path);
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      describe: req.body.describe,
      ImageUrl: result.secure_url,
      genre:
        typeof req.body.genre === "undefined" ? [] : req.body.genre.split(","),
    });

    console.log("BOOK: " + book);

    var errors = req.validationErrors();
    if (errors) {
      //Một số vấn đề nên chúng tôi cần re-render our books

      // Nhận tất cả các tác giả và thể loại cho biểu mẫu
      async.parallel(
        {
          authors: function (data) {
            Author.find(data);
          },
          genres: function (data) {
            Genre.find(data);
          },
        },
        function (err, data) {
          if (err) {
            return next(err);
          }

          //Đánh dấu các thể loại đã chọn của chúng tôi là đã chọn
          for (i = 0; i < data.genres.length; i++) {
            if (book.genre.indexOf(data.genres[i]._id) > -1) {
              //Thể loại hiện tại được chọn. Đặt cờ "đã kiểm tra".
              data.genres[i].checked = "true";
            }
          }

          res.render("admin/book/book_form", {
            title: "Create Book",
            authors: data.authors,
            genres: data.genres,
            book: book,
            errors: errors,
          });
        }
      );
    } else {
      // Dữ liệu từ biểu mẫu là hợp lệ.
      // Chúng ta có thể kiểm tra xem sách đã tồn tại chưa, nhưng hãy cứ lưu lại.

      book.save(function (err) {
        if (err) {
          return next(err);
        }
        //Successful - redirect to new book record.
        res.redirect("/admin/bookInventory/all/all/1");
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// Hiển thị biểu mẫu xóa sách trên GET
exports.book_delete_get = async (req, res, next) => {
  try {
    const book_id = req.params.id;
    const book = await Book.findById(book_id);
    await book.remove();
    req.flash("success", `A book named ${book.title} is just deleted!`);
    res.redirect("back");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// Hiển thị biểu mẫu cập nhật sách trên GET
exports.book_update_get = function (req, res, next) {
  // Nhận cuốn sách, tác giả và thể loại cho hình thức.
  async.parallel(
    {
      book: function (data) {
        Book.findById(req.params.book_id)
          .populate("author")
          .populate("genre")
          .exec(data);
      },
      authors: function (data) {
        Author.find(data);
      },
      genres: function (data) {
        Genre.find(data);
      },
    },
    function (err, data) {
      if (err) {
        return next(err);
      }
      if (data.book == null) {
        // No data.
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // Success
      //Đánh dấu các thể loại đã chọn của chúng tôi là đã chọn
      for (var all_g_iter = 0; all_g_iter < data.genres.length; all_g_iter++) {
        for (
          var book_g_iter = 0;
          book_g_iter < data.book.genre.length;
          book_g_iter++
        ) {
          if (
            data.genres[all_g_iter]._id.toString() ==
            data.book.genre[book_g_iter]._id.toString()
          ) {
            data.genres[all_g_iter].checked = "true";
          }
        }
      }

      res.render("admin/book/book_update", {
        title: "Update Book",
        authors: data.authors,
        genres: data.genres,
        book: data.book,
      });
    }
  );
};

// Xử lý cập nhật sách on POST
exports.book_update_post = [
  // Convert the genre to an array

  // Xác thực các trường
  body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
  body("author", "Author must not be empty.").isLength({ min: 1 }).trim(),
  body("summary", "Summary must not be empty.").isLength({ min: 1 }).trim(),
  body("describe", "describe must not be empty.").isLength({ min: 1 }).trim(),


  async (req, res, next) => {
    // Trích xuất các lỗi xác thực từ một yêu cầu

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    // Tạo đối tượng Sách với dữ liệu thoát / cắt và id cũ.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      describe: req.body.describe,
      ImageUrl: result.secure_url,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.book_id, //Điều này là bắt buộc, nếu không ID mới sẽ được chỉ định!
    });

    // Dữ liệu từ biểu mẫu là hợp lệ. Cập nhật hồ sơ.
    Book.findByIdAndUpdate(
      req.params.book_id,
      book,
      {},
      function (err, thebook) {
        if (err) {
          return next(err);
        }
        // Thành công - chuyển hướng đến trang chi tiết sách.
        res.redirect("/admin/bookInventory/all/all/1");
      }
    );
  },
];
