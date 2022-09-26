import { UnauthenticatedError } from '../errors/errors.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const {authorization:auth} = req.headers;
    if(!auth || !auth.startsWith('Bearer ')) throw new UnauthenticatedError('Authentication failed');
    try {
        const token = auth.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SOME_64BYTE_BASE64_STRING);
        //attach the user to the jobs route
        req.user = {Id : decoded.userId, name : decoded.name };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication failed')
    }
    
}

export {authMiddleware }