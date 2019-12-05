const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
};
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es Necesario']
  },
  email: {
    type: String,
    required: [true, 'El email es Necesario'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'El password es Necesario']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

usuarioSchema.methods.toJSON = function() {
  let user = this;
  let userObjec = user.toObject();
  delete userObjec.password;
  return userObjec;
};
usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico'
});
module.exports = mongoose.model('Usuario', usuarioSchema);
