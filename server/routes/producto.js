const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');

// =======================================================
// OBTENER TODOS LOS PRODUCTOS
// =======================================================
app.get('/producto', (req, res) => {
  //   populate: usuario, categoria
  // paginado
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
      if (err) {
        res.status(500).send({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        res.status(400).send({
          message: 'Productos no encontrados'
        });
      }
      Producto.countDocuments({ disponible: true }, (err, total) => {
        res.json({
          ok: true,
          productoDB,
          total
        });
      });
    });
});

// =======================================================
// OBTENER PRODUCTOS por id
// =======================================================
app.get('/producto/:id', (req, res) => {
  Producto.findById(req.params.id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
      if (err) {
        res.status(500).send({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        res.status(400).send({
          message: 'Producto no encontrado'
        });
      }
      res.json({
        ok: true,
        productoDB
      });
    });
});

// =======================================================
// Buscar  PRODUCTOS
// =======================================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  const ter = req.params.termino;
  // console.log(ter);

  const regex = new RegExp(ter, 'i');
  Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, productoDB) => {
      if (err) {
        res.status(500).send({
          ok: false,
          err
        });
      }
      res.json({ ok: true, productoDB });
      console.log(productoDB);
    });
});
// =======================================================
// crear  PRODUCTOS
// =======================================================
app.post('/producto', verificaToken, (req, res) => {
  const producto = new Producto({
    usuario: req.usuario._id,
    nombre: req.body.nombre,
    precioUni: req.body.precioUni,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria
  });
  console.log('producto', producto);

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(400).send({
        err
      });
    }
    res.json({
      ok: true,
      producto: productoDB
    });
  });

  //   grabar el usuario
  // grabar una categoria del listado
});
// =======================================================
// actualizar PRODUCTOS
// =======================================================
app.put('/producto/:id', (req, res) => {
  Producto.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false
  }).exec((err, productoDB) => {
    if (err) {
      res.status(500).send({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      res.status(400).send({
        message: 'Productos no encontrados'
      });
    }
    res.json({
      ok: true,
      productoDB,
      message: 'producto actualizado'
    });
  });
});
// =======================================================
// eliminar PRODUCTOS
// =======================================================
app.delete('/producto/:id', (req, res) => {
  //   populate: usuario, categoria
  // paginado
  Producto.findByIdAndUpdate(
    req.params.id,
    { disponible: false },
    { useFindAndModify: false },
    (err, productoDB) => {
      if (err) {
        res.status(500).send({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        res.status(400).send({
          message: 'Producto no se a podido eliminar'
        });
      }
      res.json({
        ok: true,
        message: 'producto eliminado'
      });
    }
  );
});

module.exports = app;
