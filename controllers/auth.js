import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/errors.js';
import { User } from '../models/user.js';

const register = async (req, res) => {
    
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({success : true, name : user.name, token ,  msg : 'Successfully registred'});
}

const login = async (req, res) => {

    const {email, password} = req.body;
    if(!email || !password) throw new BadRequestError('please provide email and password');
    
    const user = await User.findOne({email});
    if (!user)  throw new UnauthenticatedError('Invalid credential');
    
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch) throw new UnauthenticatedError('Invalid password');

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({success : true, name : user.name, token, msg : 'Successfully logged in'});
}

export {register, login}