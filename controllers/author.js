var async = require("async");
const PER_PAGE = 8;
var Author = require("../models/author");
var Book = require("../models/book");

// Hiển thị danh sách tất cả các tác giả
exports.author_list = async (req, res, next) => {
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
    const authors = await Author.find(searchoObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .sort([["last_name", "ascending"]]);
    const count = await Author.find(searchoObj).countDocuments();
    res.render("authors", {
      title: "Author List",
      authors: authors,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (error) {
    res.json({ error, mess: "server error", status: 500 });
  }
};
exports.findAuthors = async (req, res, next) => {
  var page = req.params.page || 1;
  const filter = req.body.filter.toLowerCase();
  const value = req.body.searChName;

  // hiển thị thông báo flash nếu trường tìm kiếm trống được gửi đến chương trình phụ trợ
  if (value == "") {
    return res.redirect("back");
  }
  const searchoObj = {};
  searchoObj[filter] = value;
  try {
    const authors = await Author.find(searchoObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .sort([["last_name", "ascending"]]);
    const count = await Author.find(searchoObj).countDocuments();
    res.render("authors", {
      title: "Author List",
      authors: authors,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (error) {
    res.json({ error, mess: "server error", status: 500 });
  }
};

exports.author_detail = async (req, res, next) => {
  var page = req.params.page || 1;
  const filter = req.params.filter;
  const value = req.params.value;
  let searchoObj = {};
  if (filter != "all" && value != "all") {
    // tìm nạp sách theo giá trị tìm kiếm và bộ lọc
    searchoObj[filter] = value;
  }
  // xây dựng đối tượng tìm kiếm
  try {
    const author = await Author.findById(req.params.author_id)
    const author_books = await Book.find({ author: req.params.author_id }, "title summary ImageUrl").skip(PER_PAGE * page - PER_PAGE)
      
    .limit(PER_PAGE)
    const count = await Author.find(searchoObj).countDocuments();
    res.render("user/authorDetails", {
      title: "Author Detail",
      author: author,
      author_books: author_books,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
}
