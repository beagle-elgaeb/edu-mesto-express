const mongoose = require("mongoose");
const validator = require("validator");

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
      validator(link) {
        return validator.isURL(link);
      },
      message: "Некорректный URL",
      require_protocol: true,
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
