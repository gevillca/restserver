require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('./routes/app');

// configuracion global de routes

app.use(require('./routes/index'));
app.listen(process.env.PORT, () => {
  console.log(`Corriendo en el puerto ${process.env.PORT}!`);
});

//Run app, then load http://localhost:3000 in a browser to see the output.

mongoose.connect(
  process.env.urlDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');
  }
);
