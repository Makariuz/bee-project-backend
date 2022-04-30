const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')

dotenv.config()


mongoose.connect(process.env.MONGO_DB_URL)

const app = express();

app.use(cors())

//sending back json and receiving json
app.use(express.json())

app.get('/', (req,res) => {
    res.send('Hello world')
})

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)

const recipeRoutes = require('./routes/recipes.routes')
app.use('/recipes', recipeRoutes)

const productsRoutes = require('./routes/products.routes')
app.use('/products', productsRoutes)


app.listen(process.env.PORT)