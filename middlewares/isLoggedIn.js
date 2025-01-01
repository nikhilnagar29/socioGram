const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect('/');
    } else {
        try {
            let data = jwt.verify(req.cookies.token, "default_secret");
            req.user = data; 
            next();
        } catch (err) {
            console.error('Error verifying token:', err.message);
            res.redirect('/');
        }
    }
};

module.exports = { isLoggedIn };
