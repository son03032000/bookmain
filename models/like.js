const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
   book_info : {
       id : {
           type : mongoose.Schema.Types.ObjectId,
           ref : 'Book', 
       },
       title : String,
       author: { type: mongoose.Schema.Types.ObjectId, ref: "Author"},
       genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
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