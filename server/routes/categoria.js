const express = require('express');

const {
  verificaToken,
  verificaAdmin_Role
} = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

// ===========================================
// MOSTRAR TODAS LAS CATEGORIAS
// ===========================================

app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({ estado: true }, 'nombre tipo estado usuarioId').exec(
    (err, categoriaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      Categoria.countDocuments({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          categoriaDB,
          total: conteo
        });
      });
    }
  );
});
// ===========================================
// MOSTRAR UNA CATEGORIA POR ID
// ===========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
  //   Categoria.findById();
  const id = req.params.id;

  Categoria.findById(id).exec((err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    // console.log('categoriaDB', categoriaDB);

    res.json({
      ok: true,
      categoriaDB
    });
  });
});
// ===========================================
// CREAR UNA CATEGORIA
// ===========================================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
  const idUser = req.usuario._id;
  let body = req.body;
  // console.log('body', body);

  const categoria = new Categoria({
    nombre: body.nombre,
    tipo: body.tipo,
    usuarioId: idUser
  });
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
  // console.log(`TOKEN DEL USUARIO ${idUser}`);
});

// ===========================================
// ACTUALIZAR UNA CATEGORIA
// ===========================================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  Categoria.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false
  }).exec((err, categoriaDB) => {
    if (err) {
      return res.status(400).send({
        message: 'categoria no encontrado'
      });
    }
    res.json({
      ok: true,
      categoriaDB
    });
  });
});

// ===========================================
// ELIMINAR UNA CATEGORIA
// ===========================================

app.delete(
  '/categoria/:id',
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    // solo un administrador
    Categoria.findByIdAndUpdate(
      req.params.id,
      { estado: false },
      { new: true }
    ).exec((err, categoriaDB) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          message: 'categoria no encontrada'
        });
      }
      res.json({
        ok: true,
        message: 'categoria eliminada',
        categoriaDB
      });
    });
  }
);

module.exports = app;
