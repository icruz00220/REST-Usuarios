require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuarios'))

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw new Error()

    console.log(`Conexion exitosa ${process.env.URI}`)
});

app.listen(process.env.PORT, () => {
    console.log(`PORT: ${process.env.PORT}`);
})