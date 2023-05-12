const router = require("express").Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
//import models:
const User = require("../models/userModel.js")


//......... Register ........
router.post("/", async (req, res) => {
    try {
        const { email, password, passwordVerify, role } = req.body
        //console.log(email, password, passwordVerify, role);

        //validation:
        //verify all fields filled:
        if (!email || !password || !passwordVerify) { return res.status(400).send("please enter all required fields!") }

        //verify uniqueness:
        const existedUser = await User.findOne({ email: email });
        //console.log(`existed User: ${existedUser}`)
        if (existedUser) { return res.status(400).send(`an account with this email already exists`) }

        //hash password:
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        //save user:
        const newUser = new User({ email, passwordHash, role })
        const savedUser = await newUser.save();
        //console.log(savedUser);
        res.send("userRouter works")
    }
    catch (err) {
        console.log(`userRouter post error: ${err}`)
        res.status(500).send()
    }
});


//........ login ........
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        //console.log(email, password);

        //validation:
        //verify all fields filled:
        if (!email || !password) { return res.status(400).send("enter all required fields!") }

        //verify user exists:
        const savedUser = await User.findOne({ email: email });
        //console.log(`existed User: ${savedUser}`)
        if (!savedUser) { return res.status(401).send(`wrong email or password!`) }

        //verify password:
        const savedPassword = savedUser.passwordHash;
        const passwordCorrect = bcrypt.compare(password, savedPassword)
        //console.log(`passwordCorrect: ${passwordCorrect}`)
        if (!passwordCorrect) { return res.status(401).send(`wrong email or password!`) }

        //create token:
        const token = jwt.sign({ user: savedUser }, process.env.JWT_SECRET)
        //console.log(`token: ${token}`);
        //send token:
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
            .json({ status: "you are logged in" });
    }
    catch (err) {
        console.log(`userRouter post error: ${err}`)
        res.status(500).send()
    }
})

//........ logout ........
router.get("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, secure: true, sameSite: "none", expires: new Date(0) })
        .json({ status: "you are logged out" });
})

//........ Get User ........
router.get("/user/:email", async (req, res) => {
    try {
        const { email } = req.params

        const user = await User.findOne({ email: email })
        res.status(200).json({ theUser: user })
    }
    catch (err) {
        console.log("userRouter get error:", err)
        res.status(500).send({ message: 'Error getting user' })
    }
})



module.exports = router;