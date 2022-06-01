const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
    "Entry",
    new mongoose.Schema({
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "id пользователя обязательный"],
            ref: "User",
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            required: [true, "id врача обязательно"],
            ref: "Doctor",
        },
        slot: Date,
        loggedHour: {
            type: Boolean,
            default: false,
        },
        loggedDay: {
            type: Boolean,
            default: false,
        },
    }),
);
