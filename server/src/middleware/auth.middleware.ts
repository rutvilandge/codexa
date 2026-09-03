import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    const cookieToken = req.cookies?.token;

    const token = bearerToken ?? cookieToken;

    console.log("AUTH DEBUG:", {
      hasAuthorization: Boolean(authHeader),
      hasBearerToken: Boolean(bearerToken),
      hasCookieToken: Boolean(cookieToken),
      jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.log(
      "AUTH VERIFY ERROR:",
      error instanceof Error ? error.message : error
    );

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};