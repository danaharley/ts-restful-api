import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res
      .status(400)
      .json({ errors: `Validation error: ${JSON.stringify(error)}` });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({ errors: error.message });
  } else {
    res.status(500).json({ error: error.message });
  }
};