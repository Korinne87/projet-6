const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');



mongoose.connect("mongodb+srv://korinne87:Crninon29>@cluster0.cgir7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


 


app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
module.exports = app;