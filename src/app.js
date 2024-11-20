const express = require('express');
const connectDB = require('../config/db'); 
require('dotenv').config(); 

const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

const mainRouter = require('./routes/mainRouter.js');
const testRoutes = require('./routes/testRoutes');


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

module.exports = app;
