const jwt = require('jsonwebtoken');

//========================
// VERIFICAR TOKEN
//========================
let verificaToken = (req, res, next) => {
  const token = req.get('token');
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'token invalido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
  // console.log(token);
};
//========================
// VERIFICAR TOKEN
//========================

let verificaAdmin_Role = (req, res, next) => {
  const usuario = req.usuario;
  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
};

module.exports = {
  verificaToken,
  verificaAdmin_Role
};
