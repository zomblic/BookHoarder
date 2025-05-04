// server/services/auth.ts

import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const getUserFromToken = (authHeader?: string) => {
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; // Bearer <token>
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new GraphQLError('Invalid or expired token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};


// Add this to auth.js:
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (typeof decoded === 'object' && decoded !== null && '_id' in decoded && 'username' in decoded) {
      req.user = decoded as { _id: unknown; username: string };
    } else {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }
    
    next();
    return;
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

