process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if (process.env.NODE_ENV === 'dev') {
    process.env.URI = 'mongodb://localhost:270}17/cafe'
    process.env.CI = '600096644558-514fe5cp3i145j2ii9h7ev9th88ems7i.apps.googleusercontent.com'

} else
    process.env.URI = process.env.MONGO_URI

process.env.CADUCIDAD = 60 * 60 * 24 * 30

process.env.FIRMA = process.env.FIRMA || 'secret'