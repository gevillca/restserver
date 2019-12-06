require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('./routes/app');

// habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));
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
