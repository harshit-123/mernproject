const mongoose = require("mongoose");
mongoose.connect(process.env.DB_HOST,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() =>{
    console.log("Database Connected Successfully");
}).catch((e) =>{
    console.log(e);
})