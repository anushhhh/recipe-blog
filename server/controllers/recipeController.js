require('../models/database');
const category = require('../models/category');
const nodemailer = require('nodemailer');
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

        const msgErrorsObj = req.flash('msgErrors');
        const msgSubmitObj = req.flash('msgSubmit');

        res.render('index', {title: 'Delish Diaries - Home', categories, food, msgErrorsObj, msgSubmitObj})
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
        
        res.render('categories', {title: 'Delish Diaries - Categories', categories})
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
        res.render('recipe', {title: 'Delish Diaries - Recipes', recipes})
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
        res.render('categories', { title: 'Delish Diaries - Categories', categoryById });
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

exports.searchRecipe = async(req, res) => {
    //searchTerm
    try {
        let searchTerm = req.body.searchTerm;
        let Searchrecipe = await recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } })
        console.log(Searchrecipe);
        res.render('search', { title: 'Delish Diaries - Search' , Searchrecipe})
    } catch(error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Error searching. Refresh page and try again :)"
        })
    }
}

exports.exploreLatest = async(req, res) => {
    try{
        const limitNumber = 20;
        const latestRecipe = await recipe.find({}).sort({_id: -1}).limit(limitNumber)
        res.render('explore-latest', { title: 'Delish Diaries - Explore Latest', latestRecipe })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Error searching. Refresh page and try again :)"
        })
    }
}

exports.showRandom = async(req, res) => {
    try{
        let count = await recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let randomRecipe = await recipe.findOne().skip(random).exec();
        res.render('show-random', { title: 'Delish Diaries - Random Recipe', randomRecipe })

    } catch(error){
        console.log(error);
        res.status(500).send({
            message: error.message || "Error showing random. Refresh page and try again :)"
        })
    }
}



// submit recipe

exports.submitRecipe = async(req, res) => {
    try{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-recipe', { title: 'Delish Diaries - Submit Recipe', infoErrorsObj, infoSubmitObj})
    } catch(error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Refresh page and try again :)"
        })
    }
}

exports.submitRecipePost = async(req, res) => {
    try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0)
        {
            console.log("No files were uploaded");
        } 
        else 
        {
            imageUploadFile = req.files.image;
            console.log(imageUploadFile);
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
            console.log(uploadPath);
            imageUploadFile.mv(uploadPath, function(error){
                if(error) return res.status(500).send(error);
            })
        }

        const newRecipe = new recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,
        })

        await newRecipe.save();
        console.log(newRecipe);
        req.flash('infoSubmit', 'Recipe has been submitted.')
        res.redirect('/submit-recipe')

    } catch(error) {
        console.log(error);
        req.flash('infoErrors', error)
        res.redirect('/submit-recipe')
    }
}


// contact us 

exports.contactUs = async(req, res) =>{
    try{
        const msgErrorsObj = req.flash('msgErrors');
        const msgSubmitObj = req.flash('msgSubmit');
        res.render('contact', {title: 'Delish Diaries - Contact Us', msgErrorsObj, msgSubmitObj})
    } catch(error){
        console.log(error);
        res.status(500).send({
            message: error.message || "Try again :)"
        })
    }
}

exports.contactUsPost = async(req, res)=>{
    try{
        const {email, name, message} = req.body;
        console.log(email + ' ' + name + ' ' + message);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'anushkaty29@gmail.com',
                pass: 'ywbirdxnyjqtiklv'
            }
        })

        const mailOptions = {
            from: email,
            to: 'anushkaty29@gmail.com',
            subject: `Message from ${email}: New Message`,
            text: `${message}`
        }

        transporter.sendMail(mailOptions, (error, info)=>{
            if(error) {
                console.log(error);
                req.flash('msgErrors', error)
            }
            else{
                console.log("Email sent: " + info.response);
            }
        });
        req.flash('msgSubmit', 'Your message has been sent. We will get back to you asap!')
        res.redirect('/contact')

    } catch(error){
        console.log(error);
        req.flash('msgErrors', error)
        res.redirect('/contact')
    }
}

// about us

exports.aboutUs = async(req, res)=>{
    try{
        res.render('about', { title: 'Delish Diaries - About Us'})
    } catch(error){
        console.log(error);
        res.status(500).send({
            message: error.message || "Refresh page and try again :)"
        })
    }
}
