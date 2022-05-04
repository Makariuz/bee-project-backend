const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')

const stripe = require("stripe")('pk_live_51KvQIkDZ9psjyLZNmC3JfV05iY95vaRf3Maq0v3moQ1FLVcjcni4qZGeD3dsyBz5gWmUM7OHFl4ApyM90va011AN0010qO7AUZ');


dotenv.config()


mongoose.connect(process.env.MONGO_DB_URL)

const app = express();

app.use(cors())

//sending back json and receiving json
app.use(express.json())


app.post('/create-payment-intent', async (req,res) => {
    const { items } = req.body
})

app.get('/', (req,res) => {
    res.send('Check main website!')
})

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)

const recipeRoutes = require('./routes/recipes.routes')
app.use('/recipes', recipeRoutes)

const productsRoutes = require('./routes/products.routes')
app.use('/products', productsRoutes)


app.listen(process.env.PORT)