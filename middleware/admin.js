const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const adminjs = jwt.verify(token, JWT_ADMIN_PASSWORD)

    if (adminjs) {
        req.userId = adminjs.id


        next();
    }


    else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }


}


module.exports = {
    adminMiddleware: adminMiddleware
}