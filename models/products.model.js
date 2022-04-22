const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: { 
        type: String,
        default: 'https://res.cloudinary.com/portkey/image/upload/v1645273815/profile-pictures/hp_owshdn.png'
    },
    qtd: {
        type: Number,
        default: 1,
    }

})

const Product = model('Product', productSchema)

module.exports = Product;