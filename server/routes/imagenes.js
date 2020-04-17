const fs = require('fs')
const path = require('path')

const express = require('express')
const app = express()

app.get('/imagen/:tipo/:archivo', (req, res) => {
    let tipo = req.params.tipo
    let archivo = req.params.archivo


    let pathurl = path.resolve(__dirname, `../../uploads/${tipo}/${archivo}`)
    if (fs.existsSync(pathurl))
        res.sendFile(pathurl)
    else {
        let imgdef = path.resolve(__dirname, '../assets/img-not-found.png')
        res.sendFile(imgdef)
    }
})

module.exports = app