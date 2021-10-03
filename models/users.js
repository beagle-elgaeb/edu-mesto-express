const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Имя должно быть введено"],
    minlength: [2, "Слишком короткое имя"],
    maxlength: [30, "Слишком длинное имя"],
  },
  about: {
    type: String,
    required: [true, "Описание должно быть введено"],
    minlength: [2, "Слишком короткое описание"],
    maxlength: [30, "Слишком длинное описание"],
  },
  avatar: {
    type: String,
    required: [true, "Ссылка должна быть введена"],
    validate: {
      validator(v) {
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(
          v
        );
      },
      message: "Некорректный URL",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
