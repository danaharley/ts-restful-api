import { NextFunction, Request, Response } from "express";
import { db } from "../application/db";
import { User } from "@prisma/client";

type UserRequest = {
  user?: User;
} & Request;

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("X-API-TOKEN");

  if (!token) {
    res.status(401).json({ errors: "Unauthorized" }).end();
  }

  const user = await db.user.findFirst({
    where: {
      token,
    },
  });

  if (user) {
    req.user = user;
    next();
    return;
  }
};
