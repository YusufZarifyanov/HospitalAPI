const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const doctors = await Doctor.find();

        res.status(200).json(doctors);
    }),
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) throw createError(400, "Доктор не найден");

        res.status(200).json(doctor);
    }),
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { slots } = req.body;
        slots.forEach((slot) => {
            if (new Date(slot) - new Date() < 0)
                throw createError(400, "Неверное время");
        });
        
        const doctor = new Doctor({ ...req.body });
        const savedDoctor = await doctor.save();

        res.status(200).json(savedDoctor);
    }),
);

router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
        const updateDoctor = await Doctor.updateOne(
            { _id: req.params.id },
            { $set: { ...req.body } },
        );

        res.status(200).json(updateDoctor);
    }),
);

router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const removedDoctor = await Doctor.remove({ _id: req.params.id });

        res.json(removedDoctor);
    }),
);

module.exports = router;
