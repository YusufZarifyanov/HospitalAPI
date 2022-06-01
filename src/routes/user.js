const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Entry = require("../models/Entry");
const Doctor = require("../models/Doctor");
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const users = await User.find();

        res.status(200).json(users);
    }),
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) throw createError(400, "Пользователь не найден");

        res.status(200).json(user);
    }),
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const {phone} = req.body
        const user = new User({ ...req.body, phone: phone.replace(/\s/g, '')});
        const savedUser = await user.save();

        res.status(200).json(savedUser);
    }),
);

router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
        const updateUser = await User.updateOne(
            { _id: req.params.id },
            { $set: { ...req.body } },
        );

        res.status(200).json(updateUser);
    }),
);

router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const removedUser = await User.remove({ _id: req.params.id });

        res.status(200).json(removedUser);
    }),
);

router.post(
    "/entry",
    asyncHandler(async (req, res) => {
        const { userId, doctorId, slot } = req.body;

        //Проверка на существование записи у доктора
        const doctor = await Doctor.findById(doctorId);

        const existDoctorTime = doctor.slots.filter(
            (date) => date.getTime() === new Date(slot).getTime(),
        );

        if (existDoctorTime.length === 0)
            throw createError(400, "У доктора нет такого времени");

        //Проверка на занятость к доктору
        const userSlotUniq = await Entry.findOne({ slot, doctorId });

        if (userSlotUniq)
            throw createError(400, "К доктору на данное время уже записаны");

        // Проверка на существование строки в Entry
        const existEntry = await Entry.findOne({ userId, doctorId });

        if (existEntry) throw createError(400, "Данный пользователь уже записан к доктору");

        const entry = new Entry({ ...req.body, slot: new Date(slot) });
        await entry.save();

        res.status(200).json({
            message: `Пользователь с id = ${userId} успешно записан к доктору с id=${doctorId} на время ${slot}`,
        });
    }),
);

module.exports = router;
