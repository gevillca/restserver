const express = require('express');

const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const {
  verificaToken,
  verificaAdmin_Role
} = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {
  // return res.json({
  //   usuario: req.usuario,
  //   nombre: req.usuario.nombre,
  //   email: req.usuario.email
  // });

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
      Usuario.countDocuments({ estado: true }, (err, conteo) => {
        res.json({ ok: true, usuarios, cuantos: conteo });
      });
    });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
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

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  let body = req.body;
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, useFindAndModify: false },
    (err, usuarioDB) => {
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
    }
  );
});

app.delete('/usuario/:id', verificaToken, (req, res) => {
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
