const mongoose = require('mongoose');

let Schema = mongoose.Schema
let schemaCategoria = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    estado: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Categorias', schemaCategoria)