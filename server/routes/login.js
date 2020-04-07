const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const jwt = require('jsonwebtoken');
// const { tokenauth } = require('../middlewares/token')
const express = require('express')
const app = express()

app.post('/login', function(req, res) {
    let body = req.body

    Usuario.findOne({ email: body.email }, (err, resp) => {
        if (err)
            return res.status(500).json({
                'ok': false,
                err
            })

        if (!resp)
            return res.status(400).json({
                'ok': false,
                err: {
                    message: 'El (usuario) o contraseña es incorrecta'
                }
            })

        if (!bcrypt.compareSync(body.password, resp.password))

            return res.status(400).json({
            'ok': false,
            err: {
                message: 'El usuario o (contraseña) es incorrecta'
            }
        })
        let token = jwt.sign({
            'usuario': resp
        }, process.env.FIRMA, { expiresIn: process.env.CADUCIDAD });

        res.json({
            'ok': true,
            'usuario': resp,
            token
        })
    })
})

module.exports = app