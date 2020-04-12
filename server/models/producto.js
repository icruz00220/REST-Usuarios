const uniqueValidator = require('mongoose-unique-validator');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio Ãºnitario es necesario'] },
    descripcion: { type: String, required: false },
    estado: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categorias', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

productoSchema.plugin(uniqueValidator, { message: 'El {PATH} no se puede duplicar' })


module.exports = mongoose.model('Productos', productoSchema);