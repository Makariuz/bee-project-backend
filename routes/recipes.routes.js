const express = require("express");
const User = require("../models/user.model");
const Recipes = require("../models/recipes.model");
const Products = require("../models/products.model");
const { authenticateToken } = require("../middlewares/jwt.middleware");
const Recipe = require("../models/recipes.model");
const multer = require("multer");
const upload = require("../config/cloudstorage");

const router = express.Router();

router.get("/", async (req, res) => {
  const recipes = await Recipes.find().populate("author");

  res.status(200).json(recipes);
});

// get all recipes for a user
router.get("/user/saved", authenticateToken, async (req, res) => {

  const user = await User.findById(req.jwtPayload.user._id).populate("recipes");

  res.status(200).json(user.recipes);
});

router.post("/upload", upload.single("image"), (req, res) => {
  res.json(req.file);
});

router.post("/create", authenticateToken, async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  try {
    const recipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      image,
      author: req.jwtPayload.user._id,
    });

   

    res.status(200).json(recipe);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post('/save/:id', authenticateToken, async (req,res) => {
  const user = await User.findById(req.jwtPayload.user._id)
 
  user.recipes.push(req.params.id)
  await user.save()

  res.status(200).json(user)

})

router.get("/read/:id", async (req, res) => {
  const recipe = await Recipes.findById(req.params.id).populate("author");

  recipe !== null
    ? res.status(200).json(recipe)
    : res.status(200).json("not found");
});

router.put("/edit/:id", authenticateToken, async (req, res) => {
  const { newTitle, newIngredients, newInstructions, newImage } = req.body;
  const recipe = await Recipes.findByIdAndUpdate(
    req.params.id,
    {
      title: newTitle,
      ingredients: newIngredients,
      instructions: newInstructions,
      image: newImage,
    },
    { new: true }
  );

  res.status(200).json(recipe);
});

router.delete('/saved/:id', authenticateToken, async (req,res) => {
  const recipe = await Recipes.findById(req.params.id)
  const user = await User.findById(req.jwtPayload.user._id)
  user.recipes = user.recipes.filter((recipe) => recipe._id.toString() !== req.params.id)
  await user.save()
  res.status(200).json("deleted");
})

router.delete("/:id", authenticateToken, async (req, res) => {
  const recipe = await Recipes.findById(req.params.id).populate('author')
  const user = await User.findById(req.jwtPayload.user._id)
 
  user.recipes = user.recipes.filter((recipe) => recipe._id.toString() !== req.params.id)
  //console.log(user.recipes)
  await user.save()
  await Recipe.findByIdAndDelete(req.params.id);
  res.status(200).json("deleted");

});

module.exports = router;
