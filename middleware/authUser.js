const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        if (user && bcrypt.compareSync(credentials.pass, user.password)) {
            req.currentUser = user;
            return next();
        }
    }
    res.status(401).json({ message: 'Access Denied' });
};
