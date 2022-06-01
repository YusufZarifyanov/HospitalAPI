const mongoose = require("mongoose");

module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        phone: {
            type: String,
            required: [true, "Телефон обязательный"],
            unique: [true, "Номер телефона уже существует"],
        },
        name: {
            type: String,
            required: [true, "Имя обязательно"],
        },
    }),
);
