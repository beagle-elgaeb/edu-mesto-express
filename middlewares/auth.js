const jwt = require("jsonwebtoken");

const Unauthorized = require("../errors/unauthorized-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const biscuit = req.cookies.jwt;

  if (!biscuit) {
    throw new Unauthorized("Необходимо авторизоваться");
  }

  let payload;

  try {
    payload = jwt.verify(
      biscuit,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
  } catch (err) {
    throw new Unauthorized("Необходимо авторизоваться");
  }

  req.user = payload;

  next();
};
