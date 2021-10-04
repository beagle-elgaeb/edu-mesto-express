const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "615ac15d8bab42c25d228d8f",
  };

  next();
});

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Запрошена несуществующая страница" });
});

app.listen(PORT, () => {
  console.info(`App слушает порт ${PORT}`);
});
