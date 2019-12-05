process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// fecha de vencimiento

process.env.CADUCIDAD_TOKEN = 60 * 60 * 60 * 24 * 30;

// seed de autentificaion
process.env.SEED = process.env.SEED || 'clave-desarrollo';
// base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost/dbcafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;
