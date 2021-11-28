const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
   book_info : {
       id : {
           type : mongoose.Schema.Types.ObjectId,
           ref : 'Book', 
       },
       title : String,
       ImageUrl: String, 
   },
   user_id : {
       id : {
           type : mongoose.Schema.Types.ObjectId,
           ref : 'User',
       },
       username : String,
   },
});

module.exports = mongoose.model("Like", likeSchema);
