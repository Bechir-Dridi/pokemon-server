const wallPaperModel = require("../models/wallPaperModel.js");
const router = require("express").Router();
const multer = require('multer');
//imoprt MIDDELEWARES:
const { auth, authRoles } = require("../middleware/auth.js");



//setup Multer:
//Define the storage options for Multer:
//const storageFolder = require("../media")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
        //cb(null, "C:/Users/bachi/Documents/my docs/1.JsWeb BOX/React Box/pokemon/server/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
//Create a Multer instance with the storage options:
const upload = multer({ storage: storage });

//                       =============== Post ===============
router.post("/", auth, authRoles(["admin"]), upload.single('img'), async (req, res) => {
    try {
        const { filename } = req.file;
        const newWallPaper = new wallPaperModel({ filename })

        const savedWallPaper = await newWallPaper.save();
        res.status(200).json({ wallPaper: savedWallPaper });
    } catch (err) {
        console.log("wallPaperRouter post error:", err)
        res.status(500).send({ message: 'Error uploading image' })
    }
});

//                       =============== Get ===============
router.get("/", auth, authRoles(["admin", "user"]), async (req, res) => {
    try {
        const wallPapers = await wallPaperModel.find()
        res.status(200).json({ wallPapers: wallPapers })
    }
    catch (err) {
        console.log("wallPaperRouter get error:", err)
        res.status(500).send({ message: 'Error downloading image' })
    }
})

module.exports = router;