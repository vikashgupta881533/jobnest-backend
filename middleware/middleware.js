const jwt = require('jsonwebtoken')

// Checks the token is valid and attaches the logged-in user's
// { userid, role } to req.user so any controller after this can use it.
const authmiddle = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json("no token provided")
    }

    // allow both "Bearer <token>" and plain "<token>"
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1]
    }

    try {
        const verified = jwt.verify(token, "secretkey")
        req.user = verified   // { userid, role }
        next()
    } catch (err) {
        return res.status(401).json("invalid or expired token")
    }
}

module.exports = authmiddle;