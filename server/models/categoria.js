const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
// const rolesValidos = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} no es un rol valido'
// };
const Schema = mongoose.Schema;
const categoriaShema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoria es necesario']
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de la categoria es necesario']
  },
  estado: {
    type: String,
    default: true
  },
  img: {
    type: String,
    required: false
  },
  usuarioId: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Categoria', categoriaShema);
