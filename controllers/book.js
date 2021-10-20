var Book = require("../models/book");
const PER_PAGE = 9;

// Hiển thị danh sách tất cả sách
exports.book_list = async (req, res, next) => {
  var page = req.params.page || 1;
  const filter = req.params.filter;
  const value = req.params.value;
  let searchoObj = {};
  // xây dựng đối tượng tìm kiếm

  if (filter != "all" && value != "all") {
    // tìm nạp sách theo giá trị tìm kiếm và bộ lọc
    searchoObj[filter] = value;
  }
  try {
    // Tìm nạp sách từ cơ sở dữ liệu
    const books = await Book.find(searchoObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .populate("author")
      .populate("genre")
      .populate("likes");
    // Lấy tổng số sách có sẵn của bộ lọc nhất định
    const count = await Book.find(searchoObj).countDocuments();

    res.render("books", {
      books: books,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.findBooks = async (req, res, next) => {
  var page = req.params.page || 1;
  const filter = req.body.filter.toLowerCase();
  const value = req.body.searChName;

  // hiển thị thông báo flash nếu trường tìm kiếm trống được gửi đến chương trình phụ trợ
  if (value == "") {
    req.flash(
      "error",
      "Trường tìm kiếm trống. Vui lòng điền vào trường tìm kiếm để nhận được kết quả"
    );
    return res.redirect("back");
  }
  const searchoObj = {};
  searchoObj[filter] = value;

  try {
    // Tìm nạp sách từ cơ sở dữ liệu
    const books = await Book.find(searchoObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .populate("author");
    // Lấy tổng số sách có sẵn của bộ lọc nhất định
    const count = await Book.find(searchoObj).countDocuments();

    res.render("books", {
      title: "Book List",
      books: books,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
};

// Hiển thị trang chi tiết cho một cuốn sách cụ thể
exports.book_detail = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id)
      .populate("comments")
      .populate("author")
      .populate("genre")
    //Successful, so render
    res.render("user/bookDetails", {
      title: "Title",
      book: book,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};