require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');


mongoose.connect("mongodb+srv://korinne87:Crninon29@cluster0.cgir7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",

  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


 
app.use(helmet());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(mongoSanitize());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;