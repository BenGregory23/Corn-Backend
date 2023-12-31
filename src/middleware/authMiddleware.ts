import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }



  try {
    const decoded = jwt.sign(token, process.env.JWT_SECRET!);

   
    (req as any).decoded = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
