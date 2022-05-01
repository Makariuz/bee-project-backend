const express = require('express')
const User = require('../models/user.model')
const Recipes = require('../models/recipes.model')
const Products = require('../models/products.model')
const multer  = require('multer')
const upload = require('../config/cloudstorage')



const router = express.Router()

router.get('/', async (req,res) => {
    const products = await Products.find()
    res.status(200).json(products)
   
})



router.get('/:id', async (req,res) => {
    const product = await Recipes.findById(req.params.id)
    product !== null ? 
    res.status(200).json(product)
    :
    res.status(200).json('not found')
})

router.post('/upload', upload.single('image'), (req, res) => {

    res.json(req.file)

})

router.post('/add', async (req,res) => {
    const { name, image, description, price} = req.body;
    const products = await Products.create({
        name,
        image,
        description,
        price
    })
    res.status(200).json(products)
})



module.exports = router