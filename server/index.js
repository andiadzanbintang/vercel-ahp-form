require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const expressMongoSanitize = require('express-mongo-sanitize');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log('Something went wrong:', err));


app.set('trust proxy', true);
// Middleware
app.use(express.json({ limit: "50mb" }));
 
app.use(helmet());
app.use(expressMongoSanitize()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// ganti blok CORS di server:
app.use(cors({
  origin: true,
  credentials: true,
}));



// Routes
app.use('/api/v1/form', require('../server/routes/formRoutes')); // form routes
app.use('/api/v1/admin', require('../server/routes/adminRoutes')); // admin routes

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
