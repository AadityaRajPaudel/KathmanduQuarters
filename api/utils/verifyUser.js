const jwt = require("jsonwebtoken");
const errorThrower = require("./error");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorThrower(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorThrower(403, "Forbidden"));

    req.user = user; // returns the user with that token id
    next(); // runs the user.route's update's second function
  });
};

module.exports = verifyToken;
