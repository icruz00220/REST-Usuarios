const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const { tokenauth } = require('../middlewares/token')
const fs = require('fs')
const path = require('path')

const express = require('express')
const app = express()

app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:tipo/:id', tokenauth, (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se subio ningun archivo'
        });
    }

    let tipo = req.params.tipo
    let id = req.params.id

    let tipovalido = ['usuarios', 'productos']

    if (tipovalido.indexOf(tipo) < 0)
        return res.status(500).json({
            ok: false,
            message: `Tipo incorrecto, solo se permiten ${tipovalido.join(', ')}`,
            tipo
        })

    let archivo = req.files.archivo;

    let busext = archivo.name.split('.')
    let ext = busext[busext.length - 1]

    let extvalidas = ['jpg', 'jpeg', 'gif', 'png']

    if (extvalidas.indexOf(ext) < 0)
        return res.status(500).json({
            ok: false,
            message: `Extension incorrecta, solo se permiten ${extvalidas.join(', ')}`,
            extension: ext
        })

    let nombre = `${id}-${new Date().getMilliseconds()}.${ext}`

    archivo.mv(`uploads/${tipo}/${nombre}`, err => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        if (tipo === 'usuarios')
            updUsuario(res, id, nombre)
        else
            updProducto(res, id, nombre)
    })
})

function borrarArchivo(tipo, archivo) {
    let pathurl = path.resolve(__dirname, `../../uploads/${tipo}/${archivo}`)
    if (fs.existsSync(pathurl))
        fs.unlinkSync(pathurl)
}

function updUsuario(res, id, nombre) {
    const tipo = 'usuarios'
    Usuario.findById(id, (err, user) => {
        if (err) {
            borrarArchivo(tipo, nombre)
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!user) {
            borrarArchivo(tipo, nombre)
            return res.status(400).json({
                ok: false,
                err: { message: 'El id de usuario es incorrecto' }
            })
        }

        borrarArchivo(tipo, user.img)
        user.img = nombre

        user.save((err, resp) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                })

            res.json({
                ok: true,
                message: 'File uploaded!',
                usuario: resp,
                imagen: nombre
            })
        })


    })
}

function updProducto(res, id, nombre) {
    const tipo = 'productos'
    Producto.findById(id, (err, product) => {
        if (err) {
            borrarArchivo(tipo, nombre)
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!product) {
            borrarArchivo(tipo, nombre)
            return res.status(400).json({
                ok: false,
                err: { message: 'El id de producto es incorrecto' }
            })
        }

        borrarArchivo(tipo, product.img)
        product.img = nombre

        product.save((err, resp) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                })

            res.json({
                ok: true,
                message: 'File uploaded!',
                producto: resp,
                imagen: nombre
            })
        })


    })
}

module.exports = app