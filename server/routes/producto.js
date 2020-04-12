const Producto = require('../models/producto')
const { tokenauth, admin } = require('../middlewares/token')
const express = require('express')
const app = express()

app.post('/producto', tokenauth, (req, res) => {
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        estado: body.estado,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, resp) => {
        if (err)
            return res.status(400).json({
                'ok': false,
                err
            })

        res.json({
            'ok': true,
            'categoria': resp
        })
    })
})

app.get('/producto', tokenauth, (req, res) => {
    Producto
        .find({ estado: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, resp) => {
            if (err)
                return res.status(400).json({
                    'ok': false,
                    err
                })
            Producto.count({ estado: true }, (err, conteo) => {
                res.json({
                    'ok': true,
                    'producto': resp,
                    conteo
                })
            })

        })
})

app.get('/producto/:id', tokenauth, (req, res) => {
    let id = req.params.id
    Producto
        .findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, resp) => {
            if (err)
                return res.status(500).json({
                    'ok': false,
                    err
                })

            if (!resp)
                return res.status(400).json({
                    'ok': false,
                    err: {
                        message: "El producto no existe"
                    }
                })
            res.json({
                'ok': true,
                'producto': resp
            })
        })
})

app.get('/producto/buscar/:termino', tokenauth, (req, res) => {
    let termino = req.params.termino
    let exptermino = new RegExp(termino, 'i')

    Producto
        .find({ nombre: exptermino, estado: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, resp) => {
            if (err)
                return res.status(400).json({
                    'ok': false,
                    err
                })
            Producto.count({ nombre: exptermino, estado: true }, (err, conteo) => {
                res.json({
                    'ok': true,
                    'producto': resp,
                    conteo
                })
            })

        })
})

app.put('/producto/:id', tokenauth, (req, res) => {
    let id = req.params.id

    Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, resp) => {
        if (err)
            return res.status(500).json({
                'ok': false,
                err
            })
        if (!resp)
            return res.status(400).json({
                'ok': false,
                err: {
                    message: 'El producto no existe'
                }
            })

        res.json({
            'ok': true,
            'producto': resp
        })
    })
})

app.delete('/producto/:id', [tokenauth, admin], (req, res) => {
    let id = req.params.id
    Producto.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, resp) => {
        if (err)
            return res.status(500).json({
                'ok': false,
                err
            })

        if (!resp)
            return res.status(400).json({
                'ok': false,
                err: {
                    message: 'El producto no existe'
                }
            })

        res.json({
            'ok': true,
            'producto': resp
        })
    })
})

module.exports = app