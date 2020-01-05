const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();
const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'no se ha seleccionado ningun archivo'
    });
  }

  // validar tipo
  const tiposValidos = ['usuarios', 'producto'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'los tipos permitidos ' + tiposValidos,
      ext: tipo
    });
  }

  let archivo = req.files.archivo;
  const extenciones = ['jpg', 'png', 'gif', 'jpeg'];
  const extencionCortada = archivo.name.split('.');
  const extencion = extencionCortada[1];

  if (extenciones.indexOf(extencion) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'extencion no valida, ' + 'extensiones validas: ' + extenciones,
      ext: extencion
    });
  }
  // Cambiar nombre del archivo
  const nombreCambiado = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  archivo.mv(`uploads/${tipo}/${nombreCambiado}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    // imagen cargada

    if (tipo === 'producto') {
      imagenProducto(id, res, nombreCambiado);
    } else {
      imagenUsuario(id, res, nombreCambiado);
    }
    // console.log(`se creo el archivo nombre_archivo`);
  });
});

function imagenUsuario(id, res, nombreCambiado) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreCambiado, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB) {
      borraArchivo(nombreCambiado, 'usuarios');
      return res.status(400).json({
        ok: false,
        message: 'usuario no existe'
      });
    }
    borraArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreCambiado;
    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuarioGuardado,
        nombreCambiado
      });
    });
  });
}

function imagenProducto(id, res, nombreCambiado) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreCambiado, 'producto');
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      borraArchivo(nombreCambiado, 'producto');
      return res.status(400).json({
        ok: false,
        message: 'producto no existe'
      });
    }

    // console.log('aaaaaa', productoDB);

    borraArchivo(productoDB.img, 'producto');

    productoDB.img = nombreCambiado;
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        productoGuardado,
        nombreCambiado
      });
    });
  });
}

function borraArchivo(nombreImage, tipo) {
  const pathImage = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImage}`
  );
  if (fs.existsSync(pathImage)) {
    fs.unlinkSync(pathImage);
  }
}

module.exports = app;
