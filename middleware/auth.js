const jwt = require("jsonwebtoken")


//------------------ authentication middleware ------------------

function auth(req, res, next) {
    try {
        //console.log(req.cookies.token)
        const token = req.cookies.token;

        //verify there's a token:
        if (!token) return res.status(401).json({ errorMsg: "unauthorized, no token found" });

        //validate the token: verify that "token" created with "JWT_SECRET".
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object:
        req.theUser = verified;
        //console.log("decodedToken:", req.theUser)

        next();
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ errorMsg: "unauthorized" })
    }
};


//----------- auth roles -------------

const authRoles = (permissions) => { //permissions: coming from the endpoint.
    return (req, res, next) => {
        const userRole = req.theUser.user.role;
        //console.log(`userRole: ${userRole}`)
        if (permissions.includes(userRole)) { return next(); }
        else {
            return res.status(401).send("Unauthorized: you don't have permission!"); // user is not authorized, send an error response
        }
    }
}



module.exports = {
    auth,
    authRoles
};