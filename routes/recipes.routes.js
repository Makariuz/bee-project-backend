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
router.get("/owned", async (req, res) => {
  console.log(req);
  const recipes = await Recipes.find({
    author: req.jwtPayload.user._id,
  }).populate("author");
  res.status(200).json(recipes);
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

router.get('/save/:id', async (req,res) => {
  const recipe = await Recipes.findById(req.params.id)

  res.status(200).json(recipe)

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

router.delete("/:id", authenticateToken, async (req, res) => {
  const recipe = await Recipes.findById(req.params.id).populate("author");

  await Recipe.findByIdAndDelete(req.params.id);
  res.status(200).json("deleted");

  // await Recipe.findByIdAndDelete(req.params.id)

  // req.jwtPayload.user._id === recipe.author.toString() && await Recipe.findByIdAndDelete(req.params.id)
});

module.exports = router;
