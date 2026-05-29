import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import config from '../config/env';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Protect routes - verify JWT token and attach user to request
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

      const user = await User.findById(decoded.id).select('+password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
        return;
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or expired',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize by role - restrict access to specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};
