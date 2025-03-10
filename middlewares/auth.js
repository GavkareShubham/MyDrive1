const jwt = require('jsonwebtoken');

//custom middleware to check if user is authenticated
function auth(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }



}

module.exports = auth;