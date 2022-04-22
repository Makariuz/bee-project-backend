const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true,
    },
    image: { 
        type: String,
        default: 'https://res.cloudinary.com/portkey/image/upload/v1645273815/profile-pictures/hp_owshdn.png'
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        /* required: true, */
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Recipe = model('Recipe', recipeSchema)

module.exports = Recipe;