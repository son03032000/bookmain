var mongoose = require("mongoose");
var moment = require("moment");

var BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  describe:{ type: String, required: true },
  ImageUrl: { type: String, required: true },
  bookDate : {type : Date, default : Date.now()},
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Like"
  }],
});

BookSchema.virtual("Ngaykhoitao").get(function () {
  return moment(this.bookDate).format("MMMM Do, YYYY");
});

//Export model
module.exports = mongoose.model("Book", BookSchema);
