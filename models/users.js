const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Unauthorized = require("../errors/unauthorized-err");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    required: false,
    minlength: [2, "Слишком короткое имя"],
    maxlength: [30, "Слишком длинное имя"],
  },
  about: {
    type: String,
    default: "Исследователь",
    required: false,
    minlength: [2, "Слишком короткое описание"],
    maxlength: [30, "Слишком длинное описание"],
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    required: false,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: "Некорректный URL",
      require_protocol: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Некорректный email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw new Unauthorized("Переданы некорректные данные");
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Unauthorized("Переданы некорректные данные");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
