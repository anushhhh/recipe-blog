const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
//app route
router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCategories);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories/:id', recipeController.exploreCategoriesById);


module.exports = router;