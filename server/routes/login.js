const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

async function verify(token) {
    console.log(token, process.env.CLIENT_ID)
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '600096644558-514fe5cp3i145j2ii9h7ev9th88ems7i.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    console.log(payload)
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken

    let googleUsuario = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e,
            message: 'El pedo es aqui'
        })
    })

    Usuario.findOne({ email: googleUsuario.email }, (err, resp) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        if (resp) {
            if (resp.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Este correo ya existe en la BD, use autenticacion normal'
                    }
                })
            } else {
                let token2 = jwt.sign({
                    usuario: resp
                }, process.env.FIRMA, { expiresIn: process.env.CADUCIDAD });

                res.json({
                    ok: true,
                    usuario: resp,
                    token2
                })
            }
        } else {
            let usuario = new Usuario()
            usuario.nombre = googleUsuario.nombre
            usuario.email = googleUsuario.email
            usuario.password = ':)'
            usuario.google = true
            usuario.img = googleUsuario.img

            usuario.save((err, usuarioDB) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err
                    })

                let token2 = jwt.sign({
                    usuario: resp
                }, process.env.FIRMA, { expiresIn: process.env.CADUCIDAD });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token2
                })
            })
        }
    })
})

module.exports = app