const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You are not signed in.")
    }
    next();
};

module.exports = { isAuthenticated }