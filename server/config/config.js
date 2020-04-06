process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if (process.env.NODE_ENV === 'dev')
    process.env.URI = 'mongodb://localhost:27017/cafe'
else
    process.env.URI = process.env.MONGO_URI

//'mongodb+srv://admin:kf6EE7cZx3A4auGU@cluster0-vvc2x.mongodb.net/test?retryWrites=true&w=majority'