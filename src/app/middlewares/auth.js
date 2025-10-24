import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth.js';

export default async (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token was not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = decoded.id;
    request.userName = decoded.name;
    request.userIsAdmin = decoded.admin; 
    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Token is invalid.' });
  }
};