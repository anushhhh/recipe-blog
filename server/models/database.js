const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("db connected");
}).catch((error)=>{
    console.log(error);
})

//Models
require('./category');
require('./recipe')