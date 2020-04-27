const jwt = require('jsonwebtoken');
const {AuthenticationError} = require('apollo-server');

const {SECRET_KEY} = require('../config');

module.exports = (context) =>{
    // context = {... headers} it for obtain token
    // usualy token is stored in authorization header as |Bearer <token>|
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid/expired token');
            }
        }

        throw new Error('token is not Bearer <token> format');
    }
    throw new Error('Authentication is not provided');

}