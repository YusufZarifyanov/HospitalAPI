const Doctor = require("../models/Doctor");
const Entry = require("../models/Entry");
const User = require("../models/User");
const fs = require("fs");
const {Console} = require("console")

const logger = new Console({
    stdout: fs.createWriteStream("entryReminder.txt"),
})

const cronFun = async () => {
    const entries = await Entry.find();

    entries.forEach(async (entry) => {
        let result;
        const currentDate = new Date();
        const entryDate = new Date(entry.slot);
        const diff = entryDate - currentDate;
        const diffHour = Math.round(diff / (1000 * 60 * 60));

        console.log(diffHour)

        if (diffHour === 24 && !entry.loggedDay) {
            result = "day";
        } else if (diffHour === 2 && !entry.loggedHour) {
            result = "hour";
        }

        if (result) {
            const doctor = await Doctor.findById(entry.doctorId);
            const user = await User.findById(entry.userId);
            if (result === "day") {
                await Entry.updateOne({ _id: entry._id }, { loggedDay: true });
                logger.log(`${currentDate} | Привет ${user.name}! Напоминаем что вы записаны к ${doctor.spec} завтра в ${entry.slot}!`)
            }

            if (result === "hour") {
                await Entry.updateOne({ _id: entry._id }, { loggedHour: true });
                logger.log(`${currentDate} | Привет ${user.name}! Вам через 2 часа к ${doctor.spec} в ${entry.slot}!`)
            }
        }
    });
};

module.exports = cronFun;
