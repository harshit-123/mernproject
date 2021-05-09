require("dotenv").config();
const express = require("express");
require("./db/conn");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Register = require("./models/registers");
const registerPartials  = require("hbs");

const port = process.env.PORT || 8000;


const static_path = path.join(__dirname,"../public");
const tamplate_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",tamplate_path);
hbs.registerPartials(partials_path);


// console.log(process.env.SECRET_KEY);

app.get("/" , (req,res) =>{
    res.render("index");
})

app.get("/register" , (req,res) =>{
    res.render("register");
})
app.get("/login" , (req,res) =>{
    res.render("login");
})
// create a new user in db
app.post("/register" , async(req,res) =>{
    try{
        const password = req.body.password;
        // const securePasword = await bcrypt.hash(password,10);
        const cpassword = req.body.confirmpassword;
        // const secureConfirmPasword = await bcrypt.hash(cpassword,10);

        if(password == cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            console.log(`The Success Part is ${registerEmployee}`);

            const token = await registerEmployee.generateAuthToken();

            console.log(`The Token Part is ${token}`);

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }else{
            res.send("Password Not Match");
        }
        
    }catch(e){
        res.status(400).send(e);
    }
})

//login check
app.post("/login", async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        // console.log(password);
        const userEmail = await Register.findOne({email: email});
        // console.log(bcrypt.compare(password,userEmail.password));
        const isMatch = await bcrypt.compare(password,userEmail.password);

        //generate middleware
        const token = await userEmail.generateAuthToken();
        console.log(`The Token Part is ${token}`);


        console.log(isMatch);
        if(isMatch){
            res.status(201).render('index');
        }else{
            res.send("Password did not match");
        }
    }catch(e){
        res.status(400).send("Invalid Email");
    }
})

app.listen(port , () => {
    console.log(`Server is running at Port No. ${port}`);
})