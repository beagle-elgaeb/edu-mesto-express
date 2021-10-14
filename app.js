const express = require("express");
const mongoose = require("mongoose");

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

app.use((req, res) => {
  res.status(404).send({ message: "Запрошена несуществующая страница" });
});

app.listen(PORT, () => {
  console.info(`App слушает порт ${PORT}`);
});
