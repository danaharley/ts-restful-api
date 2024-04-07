import bcrypt from "bcryptjs";
import { db } from "../application/db";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  UserResponse,
  toUserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const usernameExists = await db.user.findUnique({
      where: {
        username: request.username,
      },
    });

    if (usernameExists) {
      throw new ResponseError(400, "Username already exists");
    }

    const hashPassword = await bcrypt.hash(registerRequest.password, 10);

    const user = await db.user.create({
      data: {
        username: registerRequest.username,
        password: hashPassword,
        name: registerRequest.name,
      },
    });

    return toUserResponse(user);
  }
}
