/*
 * This file provides utility functions for handling JSON Web Tokens (JWT).
 * It is used for generating secure tokens for user authentication.
 */

const jwt = require('jsonwebtoken');

// Creates a signed JWT token containing the user's ID, which is used to authenticate subsequent requests.
exports.getSignedToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};