process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if (process.env.NODE_ENV === 'dev')
    process.env.URI = 'mongodb://localhost:27017/cafe'
else
    process.env.URI = process.env.MONGO_URI

process.env.CADUCIDAD = 60 * 60 * 24 * 30

process.env.FIRMA = process.env.FIRMA || 'secret'