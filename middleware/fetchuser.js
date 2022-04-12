const jwt = require('jsonwebtoken');


const JWT_SECRET = "rohan";
const fetchUsers = (req, res, next) => {

    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        console.log(error.message)
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

}

module.exports = fetchUsers;