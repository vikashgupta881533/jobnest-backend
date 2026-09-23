// Use AFTER authmiddle, e.g:
//   router.post('/jobs', authmiddle, checkRole('recruiter'), createJob)
//
// checkRole('admin')                -> only admin allowed
// checkRole('admin', 'recruiter')   -> admin OR recruiter allowed

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json("not logged in")
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json("you don't have access to do this")
        }
        next()
    }
}

module.exports = checkRole
