import { db } from "../src/application/db";

export class UserTest {
  static async delete() {
    await db.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }
}
