//bring references:
const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")

//construct server:
const app = express();
//execute dotenv:
dotenv.config()

//import router:
const userRouter = require("./routers/userRouter.js")
const wallPaperRouter = require("./routers/wallPaperRouter.js")

//Middleware:
app.use(express.json());
app.use(cookieParser())
app.use(cors(
    { origin: ["http://localhost:3000"], credentials: true, }
))
//make uploads folder static =>accessible
app.use("/uploads", express.static("uploads"));
//app.use("path",express.static("the exact folder to access "))

//avoid cors deployment problem, 
//so we allow web pages from making requests to a different domain.
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://your-react-app-domain.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//test router:
app.get("/test", (req, res) => res.send("it works"));
console.log("we are connected to server")
//userRouter:
app.use("/auth", userRouter);
//wallPaperRouter:
app.use("/wall", wallPaperRouter);

//connect to DB:
mongoose.connect(process.env.MDB_CONNECT)
    .then(() => console.log("connected to DB"))
    .catch((err) => {
        console.error(`error to connect to DB: ${err}`)
    })


const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`we are listening to server on port: ${PORT}`));

