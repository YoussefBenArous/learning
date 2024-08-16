const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const form= require('./routes/forma');
const cours = require('./routes/cours');

require('dotenv').config();
const app = express();
// Connect Database
connectDB();
// Init Middleware
app.use(express.json({ extended: false }));
// Configure session middleware
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false because we're not using HTTPS in this setup
}));
// Define Routes
app.use('/',cours);
app.use('/', authRoutes);
app.use('/',form);
const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});