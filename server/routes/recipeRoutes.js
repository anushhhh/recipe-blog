const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
//app route
router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCategories);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/show-random', recipeController.showRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipePost);
router.get('/contact', recipeController.contactUs);
router.post('/contact', recipeController.contactUsPost)
router.get('/about', recipeController.aboutUs);

module.exports = router;