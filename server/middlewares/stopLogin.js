const jwt = require("jsonwebtoken");
const user = require('../models/user');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).json({ error: "you must be login" });
    }
    else {
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token,process.env.JWT, (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "you must be login" });
            }
            else {
                // console.log(payload)
                const { _id } = payload;
                user.findById(_id).then((data) => {
                    req.user = data;
                    next();
                })

            }

        })

    }

}