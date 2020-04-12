const Categoria = require('../models/categoria')
const _ = require('underscore')
const { tokenauth, admin } = require('../middlewares/token')
const express = require('express')
const app = express()

app.post('/categoria', tokenauth, (req, res) => {
    let body = req.body

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    })

    categoria.save((err, resp) => {
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

app.get('/categoria', tokenauth, (req, res) => {
    Categoria
        .find({ estado: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, resp) => {
            if (err)
                return res.status(400).json({
                    'ok': false,
                    err
                })
            Categoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    'ok': true,
                    'categoria': resp,
                    conteo
                })
            })

        })
})

app.get('/categoria/:id', tokenauth, (req, res) => {
    let id = req.params.id
    Categoria
        .findById(id)
        .populate('usuario', 'nombre email')
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
                        message: "La categoria no existe"
                    }
                })
            res.json({
                'ok': true,
                'categoria': resp
            })
        })
})

app.put('/categoria/:id', tokenauth, (req, res) => {
    let id = req.params.id

    let body = _.pick(req.body, ['nombre', 'estado'])
    console.log(body)

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, resp) => {
        if (err)
            return res.status(500).json({
                'ok': false,
                err
            })
        if (!resp)
            return res.status(400).json({
                'ok': false,
                err: {
                    message: 'La categoria no existe'
                }
            })

        res.json({
            'ok': true,
            'categoria': resp
        })
    })
})

app.delete('/categoria/:id', [tokenauth, admin], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, resp) => {
        if (err)
            return res.status(500).json({
                'ok': false,
                err
            })
        if (!resp)
            return res.status(400).json({
                'ok': false,
                err: {
                    message: 'La categoria no existe'
                }
            })

        res.json({
            'ok': true,
            'categoria': resp
        })
    })
})

module.exports = app