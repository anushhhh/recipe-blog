require('../models/database');
const category = require('../models/category');
const recipe = require('../models/recipe');

exports.homepage = async(req, res)=>{
    try{
        const limitNumber = 5;
        const categories = await category.find({}).limit(limitNumber);
        const latest = await recipe.find({}).sort({_id: -1}).limit(limitNumber);

        const thai = await recipe.find({'category': 'Thai'}).limit(limitNumber);
        const asian = await recipe.find({'category': 'Asian'}).limit(limitNumber);
        const indian = await recipe.find({'category': 'Indian'}).limit(limitNumber);
        const american = await recipe.find({'category': 'American'}).limit(limitNumber);
        const chinese = await recipe.find({'category': 'Chinese'}).limit(limitNumber);


        const food = { latest, thai, asian, indian, american, chinese };


        res.render('index', {title: 'Cooking Blog - Home', categories, food})
    } catch(error) {
        res.status(500).send({
            message: error.message || "Error Occured"
        });
    }
}

exports.exploreCategories = async(req, res)=>{
    try{
        const limitNumber = 20;
        const categories = await category.find({}).limit(limitNumber);
        
        res.render('categories', {title: 'Cooking Blog - Categories', categories})
    } catch(error) {
        res.status(500).send({
            message: error.message || "Error loading categories. Try Again"
        });
    }
}

exports.exploreRecipe = async(req, res)=>{
    try{
        let recipeId = req.params.id;
        const recipes = await recipe.findById(recipeId);
        res.render('recipe', {title: 'Cooking Blog - Recipes', recipes})
    } catch(error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Error loading recipes. Try Again"
        });
    }
}

exports.exploreCategoriesById = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await recipe.find({ 'category': categoryId }).limit(limitNumber);
        // console.log(categoryById);
        res.render('categories', { title: 'Cooking Blog - Categories', categoryById });
    } catch(error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Error loading category. Refresh page and try again :)"
        })
    }
}

// async function insertRecipeData() {
//     try {
//         await category.insertMany([
//             {
//                 "name": "Italian",
//                 "image": "italian-food.jpg"
//             },
//             {
//                 "name": "Asian",
//                 "image": "asian-food.jpg"
//             },
//             {
//                 "name": "Dessert",
//                 "image": "dessert-food.jpg"
//             },
//         ]);
//     } catch(error) {
//         console.log("error: " + error);
//     }
// }
// insertRecipeData();