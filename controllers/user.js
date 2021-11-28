const Comment = require("../models/comment");
const Book = require("../models/book");
const User = require("../models/user");
const Activity = require("../models/activity");
const Like = require("../models/like")
const cloudinary = require("cloudinary");
// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_ID,
  api_secret: process.env.API_SECRET
})
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const PER_PAGE = 5;

exports.getUserDashboard = async (req, res, next) => {
  var page = req.params.page || 1;
  const user_id = req.user._id;
  try {
    const user = await User.findById(user_id);
    const activities = await Activity.find({ "user_id.id": req.user._id })
      .sort({ _id: -1 })
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const activity_count = await Activity.find({"user_id.id": req.user._id,}).countDocuments();
    res.render("user/index", {
      user: user,
      current: page,
      pages: Math.ceil(activity_count / PER_PAGE),
      activities: activities,
    });
  } catch (err) {console.log(err);return res.redirect("back");}
};

exports.getUserProfile = (req, res, next) => {res.render("user/profile");};

// upload image
exports.postUploadUserImage = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    let imageUrl = result.secure_url;
    user.image = imageUrl;
    await user.save();

    const activity = new Activity({
      category: "Upload Photo",
      user_id: {id: req.user._id,username: user.username,},
    });
    await activity.save();

    res.redirect("/user/1/profile");
  } catch (err) {console.log(err);res.redirect("back");}
};

//update pass
exports.putUpdatePassword = async (req, res, next) => {
  const username = req.user.username;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  try {
    const user = await User.findOne(username);
    await user.changePassword(oldPassword, newPassword);
    await user.save();
    const activity = new Activity({
      categogy: "Update Password",
      user_id: {id: req.user._id,username: user.username,},
    });
    await activity.save();
    res.redirect("/auth/user-login");
  } catch (err) {console.log(err);return res.redirect("back");}
};

// update profile
exports.putUpdateUserProfile = async (req, res, next) => {
  try {
    const userUpdateInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
    };
    await User.findByIdAndUpdate(req.user._id, userUpdateInfo);

    const activity = new Activity({
      categogy: "Update Profile",
      user_id: {id: req.user._id,username: req.user.username},
    });
    await activity.save();
    res.redirect("back");
  } catch (err) {console.log(err);return res.redirect("back");}
};
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    await user.remove();
    res.redirect("/");
  } catch (err) {console.log(err);return res.redirect("back");}
};
exports.getUserProfile1 = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findById(user_id);
    const comments = await Comment.find({ "author.id": user_id });
    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );
    res.render("user/user", {
      user: user,
      comments: comments,
      activities: activities,
    });
  } catch (err) {console.log(err);res.redirect("back");}
};

exports.user_list = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const users = await User.find().skip(PER_PAGE * page - PER_PAGE).limit(PER_PAGE);
    const users_count = await User.find().countDocuments();

    res.render("user/users", {
      users: users,
      current: page,
      pages: Math.ceil(users_count / PER_PAGE),
    });
  } catch (err) {console.log(err);res.redirect("back");}
};
exports.postShowSearchedUser = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const search_value = req.body.searchUser;

    const users = await User.find({
      $or: [
        { firstName: search_value },
        { lastName: search_value },
        { userName: search_value },
        { email: search_value },
      ],
    });
    if (users.length <= 0) {
      return res.redirect("back");
    } else {
      res.render("user/users", {
        users: users,
        current: page,
        pages: 0,
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

exports.postNewComment = async (req, res, next) => {
  try {
    const comment_text = req.body.comment;
    const user_id = req.user._id;
    const username = req.user.username;
    // tìm nạp sách được nhận xét bằng id
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);
    // tạo comment mới
    const comment = new Comment({
      text: comment_text,
      author: {
        id: user_id,
        username: username,
      },
      book: {
        id: book._id,
        title: book.title,
      },
    });
    await comment.save();
    // đẩy id nhận xét vào sách
    book.comments.push(comment._id);
    await book.save();
    // logging the activity
    const activity = new Activity({
      info: {id: book._id,title: book.title},
      category: "Comment",
      user_id: {id: user_id,username: username},
    });
    await activity.save();
    res.redirect("/books/details/" + book_id);
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
exports.postUpdateComment = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  const comment_text = req.body.comment;
  const book_id = req.params.book_id;

  const username = req.user.username;
  const user_id = req.user._id;

  try {
    // fetching the comment by id
    await Comment.findByIdAndUpdate(comment_id, comment_text);

    // fetching the book
    const book = await Book.findById(book_id);

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Update Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // redirecting
    res.redirect("/books/details/" + book_id);
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

exports.deleteComment = async (req, res, next) => {
  const book_id = req.params.book_id;
  const comment_id = req.params.comment_id;
  const user_id = req.user._id;
  const username = req.user.username;
  try {
    // fetching the book
    const book = await Book.findById(book_id);

    // finding the position and popping comment_id
    const pos = book.comments.indexOf(comment_id);
    book.comments.splice(pos, 1);
    await book.save();

    // removing comment from Comment
    await Comment.findByIdAndRemove(comment_id);

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Delete Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // redirecting
    res.redirect("/books/details/" + book_id);
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

exports.getUserAllActivities = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );
    res.render("user/activities", { activities: activities });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};
exports.postShowActivitiesByCategory = async (req, res, next) => {
  try {
    const activities = await Activity.find({ Category: req.body.category });
    res.render("user/activities", { activities });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

//user -> like a book
exports.postLikeBook = async(req, res, next) => {
  try {
      const book = await Book.findById(req.params.book_id);
      const user = await User.findById(req.params.user_id);
      // registering like
      const like =  new Like({
          book_info: {
              id: book._id,
              title: book.title,
              ImageUrl: book.ImageUrl,           
          },
          user_id: {
              id: user._id,
              username: user.username,
          }
      });
      // putting like record on individual user document
      user.bookLikeInfo.push(book._id);  
      // await ensure to synchronously save all database alteration
      await like.save();
      await user.save();
      await book.save();
      res.redirect("/books/all/all/1");
  } catch(err) {
      console.log(err);
      return res.redirect("back");
  }
}

exports.getShowFavorite = async(req, res, next) => {
  const user_id = req.user._id;
  try {
      const like = await Like.find({"user_id.id": user_id});
      res.render("user/favorite", {user: like,});
  } catch (err) {
      console.log(err);
      return res.redirect("back");
  }
}

exports.postDislikeBook = async(req, res, next) => {
  try {
      // finding the position
      const book_id = req.params.book_id;
      const pos = req.user.bookLikeInfo.indexOf(req.params.book_id);
      
      // fetching book from db and increament
      const book = await Book.findById(book_id);
      await book.save();

      // removing like 
      const like =  await Like.findOne({"user_id.id": req.user._id});
      await like.remove();

      // popping book like info from user
      req.user.bookLikeInfo.splice(pos, 1);
      await req.user.save();

      // redirecting
      res.redirect("/books/all/all/1");
  } catch(err) {
      console.log(err);
      return res.redirect("back");
  }
}
