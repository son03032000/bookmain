var Book = require("../models/book");
var async = require("async");
var Genre = require("../models/genre");
const PER_PAGE = 8;

exports.genre_list = async (req, res) => {
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
    const genres = await Genre.find(searchoObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .sort([["name", "ascending"]]);
    const count = await Genre.find(searchoObj).countDocuments();
    res.render("genres", {
      title: "Genre List",
      genres: genres,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.json({ error, mess: "server error", status: 500 });
  }
};
exports.FindGenres = async (req, res, next) => {
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
    const genres = await Genre.find(searchoObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .sort([["name", "ascending"]]);
    const count = await Genre.find(searchoObj).countDocuments();
    res.render("genres", {
      title: "Genre List",
      genres: genres,
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
// Display detail page for a specific Genre
exports.genre_detail = async (req, res, next) => {
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
      const genre = await Genre.findById(req.params.genre_id)
      const genre_books = await Book.find({genre: req.params.genre_id})
      .skip(PER_PAGE * page - PER_PAGE) 
      .limit(PER_PAGE)
      const count = await Genre.find(searchoObj).countDocuments();
        //Successful, so render
        res.render("user/genreDetails", {
          title: "Genre Detail",
          genre: genre,
          genre_books: genre_books,
          current: page,
          pages: Math.ceil(count / PER_PAGE),
          filter: filter,
          value: value,
          user: req.user,
        });
 
  } catch (error) {
    console.log(error);
    res.json({ error, mess: "server error", status: 500 });
  }
};
