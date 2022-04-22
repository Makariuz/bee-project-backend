const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    picture: { 
        type: String,
        default: 'https://res.cloudinary.com/portkey/image/upload/v1645273815/profile-pictures/hp_owshdn.png'
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    recipes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Recipe'
    }]
})

const User = model('User', userSchema)

module.exports = User;