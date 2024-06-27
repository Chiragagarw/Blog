require("dotenv").config();
const express = require("express");
const connectDB = require('./config/db');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const commentRoutes = require('./routes/Commentroute');
const postRoutes = require('./routes/Postroute');
const userRoutes = require('./routes/Userroute');
const adminRoutes = require('./routes/Adminroute');
const handleError = require('./middleware/errormiddleware');

const app = express();
connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// Error Handling Middleware
app.use(handleError);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });