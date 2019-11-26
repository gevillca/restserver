process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost/dbcafe';
} else {
  urlDB = 'mongodb+srv://sylar:dota123@cluster1-nrbne.mongodb.net/test';
}

process.env.urlDB = urlDB;
