const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')

const tokenauth = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, process.env.FIRMA, function(err, decoded) {
        if (err)
            return res.status(401).json({
                'ok': false,
                err
            })
        req.usuario = decoded.usuario

        next()
    });
}

const admin = (req, res, next) => {
    if (req.usuario.role === 'ADMIN_ROLE')
        next()
    else
        return res.status(400).json({
            'ok': false,
            err: {
                message: 'El usuario no tiene permisos de administrador'
            }
        })
}

module.exports = {
    tokenauth,
    admin
}