const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(res, req, next) {
    const token = req.headers.authorization;
    const userjs = jwt.verify(token, JWT_USER_PASSWORD)

    if (userjs) {
        req.userId = userjs.id


        next();
    }


    else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }


}


module.exports = {
    userMiddleware: userMiddleware
}