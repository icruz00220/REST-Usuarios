const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const _ = require('underscore')
const { tokenauth, admin } = require('../middlewares/token')
const express = require('express')
const app = express()


app.get('/usuario', [tokenauth], (req, res) => {
    // return res.json(req.usuario)
    let limite = req.query.limite || 10
    limite = Number(limite)

    let desde = req.query.desde || 0
    desde = Number(desde)

    Usuario
        .find({ estado: true }, 'nombre email role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, resp) => {
            if (err)
                return res.status(400).json({
                    'ok': false,
                    err
                })
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    'ok': true,
                    'usuario': resp,
                    conteo
                })
            })

        })
})

app.put('/usuario/:id', [tokenauth, admin], (req, res) => {
    let id = req.params.id

    let body = _.pick(req.body, ['nombre', 'email', 'role', 'imagen', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, resp) => {
        if (err)
            return res.status(400).json({
                'ok': false,
                err
            })

        res.json({
            'ok': true,
            'usuario': resp
        })
    })
})

app.post('/usuario', [tokenauth, admin], (req, res) => {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, resp) => {
        if (err)
            return res.status(400).json({
                'ok': false,
                err
            })

        res.json({
            'ok': true,
            'usuario': resp
        })
    })
})

app.delete('/usuario/:id', [tokenauth, admin], (req, res) => {
    let id = req.params.id
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, resp) => {
        if (err)
            return res.status(400).json({
                'ok': false,
                err
            })
        if (!resp)
            return res.status(400).json({
                'ok': false,
                err: {
                    message: 'El usuario no existe'
                }
            })

        res.json({
            'ok': true,
            'usuario': resp
        })
    })
})

module.exports = app