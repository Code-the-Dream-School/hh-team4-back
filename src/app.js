const express = require("express");
const connectDB = require("../config/db");
const medicationRoutes = require("./routes/medicationRoutes.js");
require("dotenv").config();


const mainRouter = require('./routes/mainRouter.js');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");


const mainRouter = require("./routes/mainRouter.js");
const testRoutes = require("./routes/testRoutes");
const errorHandler = require("./middleware/errorHandler.js");

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/test', testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", mainRouter);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/inventory", medicationRoutes);

app.use(errorHandler);

module.exports = app;
