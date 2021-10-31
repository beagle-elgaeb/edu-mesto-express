const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const valid = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const NotFoundError = require("./errors/not-found-err");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const { createUser, login } = require("./controllers/users");

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

app.use(requestLogger);

app.post("/signup", valid.validNewUser, createUser);
app.post("/signin", valid.validLogin, login);

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(() => {
  throw new NotFoundError("Запрошена несуществующая страница");
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "Сервер не может обработать запрос" : message,
  });

  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`App слушает порт ${PORT}`);
});
