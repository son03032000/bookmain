var moment = require("moment");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, require: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date, default: "còn sống" },
  describe:{ type: String, required: true },
  ImageUrl: { type: String, required: true },
  AuthorDate : {type : Date, default : Date.now()},
});

//Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  return  this.first_name + " " + this.last_name ;
});

//Virtual for author's url
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});
AuthorSchema.virtual("Ngaykhoitao").get(function () {
  return moment(this.AuthorDate).format("MMMM Do, YYYY");
});
AuthorSchema.virtual("author_DOB_formatted").get(function () {
  return moment(this.date_of_birth).format("MMMM Do, YYYY");
});

AuthorSchema.virtual("author_DOD_formatted").get(function () {
  return moment(this.date_of_death).format("MMMM DD, YYYY");
});
//Export model
module.exports = mongoose.model("Author", AuthorSchema);
