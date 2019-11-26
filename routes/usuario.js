const express = require('express');

const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', (req, res) => {
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Usuario.find({ estado: true }, 'nombre email estado')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      Usuario.count({ estado: true }, (err, conteo) => {
        res.json({ ok: true, usuarios, cuantos: conteo });
      });
    });
});
app.post('/usuario', (req, res) => {
  let body = req.body;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    // // img:body.img,
    role: body.role
  });
  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        // ok: false,

        err
      });
    }
    // usuarioDB.password = null;

    res.json({ ok: true, usuario: usuarioDB });
  });
});
app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;
  Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});
app.delete('/usuario/:id', (req, res) => {
  let id = req.params.id;

  // Usuario.findOneAndDelete(id, (err, usuarioDB) => {
  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'usuario no encontrado'
        });
      }
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: `usuario no encontrado ${id}`
          }
        });
      }
      res.json({
        ok: true,
        // usuario: usuarioDB
        message: `usuario eliminado, ${id}`
      });
    }
  );
});

module.exports = app;
