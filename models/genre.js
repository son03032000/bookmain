var mongoose = require("mongoose");
var moment = require("moment");
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  describe:{ type: String, required: true },
  GenreDate : {type : Date, default : Date.now()},
});

GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});
GenreSchema.virtual("Ngaykhoitao").get(function () {
  return moment(this.GenreDate).format("MMMM Do, YYYY");
});

module.exports = mongoose.model("Genre", GenreSchema);
