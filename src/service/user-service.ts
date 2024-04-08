import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { db } from "../application/db";
import { ResponseError } from "../error/response-error";
import {
  CreateLoginRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  toUserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { User } from "@prisma/client";

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

  static async login(request: CreateLoginRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await db.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(loginRequest.password, user.password);

    if (!isMatch) {
      throw new ResponseError(401, "Invalid credentials");
    }

    user = await db.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;

    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await db.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(result);
  }
}
