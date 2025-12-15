import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: err.issues[0].message,
    });
  }
  console.error(err);
  return res.status(500).json({
    error: err.message || "Internal Server Error",
  });
  
}
