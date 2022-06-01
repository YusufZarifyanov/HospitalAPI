require("dotenv").config();
const express = require("express");
const userRoute = require("./routes/user");
const doctorRoute = require("./routes/doctor");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cron = require('node-cron')
const cronFunc = require("./utils/cron")

const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());

cron.schedule("* * * * *", () => {
    cronFunc()
})

app.use("/users", userRoute);
app.use("/doctor", doctorRoute);

app.use((error, req, res, next) => {
    console.log("Erro! Message: ", error.message);

    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message,
        // stack: error.stack,
    });
});

mongoose.connect(process.env.DB_CONNECTION, (err) => {
    if (err) throw err;
    console.log("Successfully connected");
});

app.listen(PORT, () => console.log(`Server running in port = ${PORT}`));
