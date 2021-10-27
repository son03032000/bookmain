const AccountModel = require("../models/user")
var jwt = require('jsonwebtoken');
const middleware = {};

middleware.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first");
    res.redirect("/auth/user-login");
};

middleware.isAdmin = function(req, res, next) {
    if(req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "Sorry, this route is allowed for admin only");
    res.redirect("/");
};


module.exports = middleware;