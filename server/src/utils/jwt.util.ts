import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import dotenv from 'dotenv';

dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET as jwt.Secret;

const signAccessToken = (payload: object) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ payload }, accessTokenSecret, {}, (err, token) => {
            if (err) {
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
};

const verifyAccessToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, accessTokenSecret, (err, payload) => {
            if (err) {
                const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return reject(createError.Unauthorized(message));
            }
            resolve(payload);
        });
    });
};

export default { signAccessToken, verifyAccessToken };
