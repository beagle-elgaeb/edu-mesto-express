const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Название должно быть введено"],
    minlength: [2, "Слишком короткое название"],
    maxlength: [30, "Слишком длинное название"],
  },
  link: {
    type: String,
    required: [true, "Ссылка должна быть введена"],
    validate: {
      validator(value) {
        return /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(
          value,
        );
      },
      message: "Некорректный URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
