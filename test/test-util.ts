import { db } from "../src/application/db";
import bcrypt from "bcryptjs";

export class UserTest {
  static async delete() {
    await db.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await db.user.create({
      data: {
        name: "test",
        username: "test",
        password: await bcrypt.hash("test", 10),
        token: "test",
      },
    });
  }
}
