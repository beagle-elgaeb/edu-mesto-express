const jwt = require("jsonwebtoken");

const Unauthorized = require("../errors/unauthorized-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Unauthorized("Необходимо авторизоваться");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return res.status(401).send({ message: "Необходимо авторизоваться" });
  }

  req.user = payload;

  next();
};
