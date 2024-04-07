import { NextFunction, Request, Response } from "express";
import { CreateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.register(reqBody);

      return res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
}
