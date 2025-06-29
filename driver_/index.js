const express = require('express')
const StaticRouter = require('./router/stat.js')
const cookieParser = require('cookie-parser')
const session = require('express-session');


const uri = "mongodb+srv://suhanagupta809036:XRqNUwIajT5Eb58T@cluster0.xnlfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const mongoose = require("mongoose");
const { validateToken } = require('./services/authentication.js');
mongoose.connect(uri).catch((err) => console.log(err));


const app = express()
app.use(express.json());
app.use(cookieParser())

app.use(
    session({
        secret: 'your_secret_key', // Replace with a secure key
        resave: false,            // Prevents resaving unchanged sessions
        saveUninitialized: false, // Do not save uninitialized sessions

    })
);


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));



app.use("/", StaticRouter)

app.listen(8011, () => {
    console.log("running at port 8011");
})
