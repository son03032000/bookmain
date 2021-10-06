var mongoose = require("mongoose");


var BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  ImageUrl: { type: String, required: true },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  postRv: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostRV"
  }]

});

//Export model
module.exports = mongoose.model("Book", BookSchema);
