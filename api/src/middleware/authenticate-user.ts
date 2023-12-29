import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/jwt/JwtService";

declare module "express-serve-static-core" {
  interface Request {
    user: { id: number; email: string; name: string };
  }
}

export default function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }
    const userTokenData = verifyToken(token);

    if (!userTokenData) {
      throw new Error("Unauthorized");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.user = userTokenData as any;
    next();
  } catch {
    res.status(401).send("Unauthorized");
    next();
  }
}
