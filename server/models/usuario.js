const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema
let schemaUsuario = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    google: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: { values: ['USER_ROLE', 'ADMIN_ROLE'], message: '{VALUE} no es valido' }
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    }
})

schemaUsuario.methods.toJSON = function() {
    let usuario = this
    let usuarioObj = usuario.toObject()
    delete usuarioObj.password
    return usuarioObj
}

schemaUsuario.plugin(uniqueValidator, { message: 'El {PATH} no se puede duplicar' })

module.exports = mongoose.model('Usuarios', schemaUsuario)