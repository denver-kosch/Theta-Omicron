import { Member } from "../mongoDB/models.js";
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from "../functions.js";
import { tokenSecret } from "../config.js";
import { hash } from "bcrypt";
import { isObjectIdOrHexString } from "mongoose";
import { ObjectId } from "mongodb";

export const login = async (req) => {
    const { email, password } = req.body;
    const member = await Member.findOne({'contactInfo.email': email}, '_id password');
    if (member && await compare(password, member.password)) {
        const token = jwt.sign({ memberId: member._id }, tokenSecret, { expiresIn: '1h' });
        return {status:200, content: {token}, token};
    } else throw new ApiError(401, 'Invalid email or password' );
};

export const auth = async (req) => {
    try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token) throw new ApiError(401, 'No token provided');
    const payload = jwt.verify(token, tokenSecret);
    const timeLeft = payload.exp - Math.floor(Date.now() / 1000);
    if (timeLeft < 10 * 60) token = jwt.sign({memberId: payload.memberId}, tokenSecret, {expiresIn: '1h'});
    
    return {status:200, content: {token}, token};
    } catch (error) {
        throw new ApiError(401, error.message);
    }
};

export const extractToken = req => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const _id = String((jwt.verify(token, process.env.SESSION_SECRET)).memberId);
        return isObjectIdOrHexString(_id) && new ObjectId(_id);
    } catch {
        return false;
    }
};

export const hashPassword = async (p) => await hash(p, 10);
