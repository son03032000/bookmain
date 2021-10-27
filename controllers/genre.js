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
  try {
    let page = req.params.page || 1;
    const filter = req.body.filter.toLowerCase();
    const value = req.body.searchName;

    if (value == "") {
      return res.redirect("back");
    }
    const searchObj = {};
    searchObj[filter] = value;

    const genres_count = await Genre.find(searchObj).countDocuments();

    const genres = await Genre.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);
    res.render("genres", {
      genres: genres,
      current: page,
      pages: Math.ceil(genres_count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.json({ error, mess: "server error", status: 500 });
  }
};
// Display detail page for a specific Genre
exports.genre_detail = async (req, res, next) => {
  try {
      const genre = await Genre.findById(req.params.genre_id)
      const genre_books = await Book.find({genre: req.params.genre_id})

        //Successful, so render
        res.render("user/genreDetails", {
          title: "Genre Detail",
          genre: genre,
          genre_books: genre_books,
          user: req.user,
        });
 
  } catch (error) {
    console.log(error);
    res.json({ error, mess: "server error", status: 500 });
  }
};
