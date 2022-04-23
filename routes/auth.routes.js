const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const User = require('../models/user.model')
const Recipes = require('../models/recipes.model')
const { authenticateToken } = require("../middlewares/jwt.middleware.js");
const multer  = require('multer')
const upload = require('../config/cloudstorage')

const router = express.Router()

router.get('/create-user', async (req, res) => {
    const  user = await User.create({
        username: 'john',
        email: 'aa@a.com',
        password: '123'
    })
    res.send(user)
})

router.post('/upload', upload.single('picture'), (req, res) => {

    res.json(req.file)

})

router.post('/new-user', async (req, res) => {
    const { username, email, picture, password } = req.body;
    console.log(req.body)
    try{
        const passwordHash = await bcrypt.hash(password,  10);
        console.log(passwordHash)
        const user = await User.create({
            username,
            email,
            picture,
            password: passwordHash,
        })

        
        return res.status(200).json(user)
     
        
    }catch(error){
        res.status(500).json(error)
    }
  
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;


    const user = await User.findOne({ email });

   try{

    if(user){

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if(passwordCorrect){
            const payload = {
               user,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                algorithm: "HS256",
                expiresIn: '2h'
            })

            res.status(200).json({
                token,
                user,
            })
        } else {
            res.status(401).send('Email or Password are incorrect');
        }
    } else {
        res.status(401).send('Email or Password are incorrect')
    }
   } catch (error){

    res.status(500).json(error)

    
   }
})

router.get("/profile", authenticateToken, async (req, res) => {
    const user = await User.findById(req.jwtPayload.user._id)
    const recipesOwned = await Recipes.find({author:req.jwtPayload.user._id.toString() }).populate('author')


    
   
    res.status(200).json({user, recipesOwned});
});

router.get('/profile/read/:id', async (req,res) => {
    const recipe = await Recipes.findById(req.params.id).populate('author')
    
    recipe !== null ? 
    res.status(200).json(recipe)
    :
    res.status(200).json('not found')
})

router.get("/verify", authenticateToken, (req, res) => {
    res.status(200).json(req.jwtPayload.user);
  });

module.exports = router