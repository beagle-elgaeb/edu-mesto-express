const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");

const NotFoundError = require("./errors/not-found-err");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { createUser, login } = require("./controllers/users");

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.post("/signup", createUser);
app.post("/signin", login);

app.use(() => {
  throw new NotFoundError("Запрошена несуществующая страница");
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(err.statusCode).send({
    message: statusCode === 500 ? "Сервер не может обработать запрос" : message,
  });

  next();
});

app.listen(PORT, () => {
  console.info(`App слушает порт ${PORT}`);
});
