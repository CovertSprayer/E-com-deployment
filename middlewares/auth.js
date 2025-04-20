
module.exports.isLoggedIn = function(req, res, next) {
  if(req.xhr && !req.isAuthenticated()){
    return res.status(401).json({
      success:false,
      message: "please login first"
    })
  }

  if(!req.isAuthenticated()){
    req.flash("error", "Please Login first!")
    return res.redirect("/login");
  }
  next();
}

module.exports.isSeller = function (req, res, next) {
  if(req.user?.role !== "seller"){
    return res.redirect("back");
  }
  next();
}
