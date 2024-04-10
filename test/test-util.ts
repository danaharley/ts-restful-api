import { Address, Contact, User } from "@prisma/client";
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

  static async get(): Promise<User> {
    const user = await db.user.findFirst({
      where: {
        username: "test",
      },
    });

    if (!user) {
      throw new Error("User is not found");
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await db.contact.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await db.contact.create({
      data: {
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        phone: "081222",
        username: "test",
      },
    });
  }

  static async get(): Promise<Contact> {
    const contact = await db.contact.findFirst({
      where: {
        username: "test",
      },
    });

    if (!contact) {
      throw new Error("Contact is not found");
    }

    return contact;
  }
}

export class AddressTest {
  static async deleteAll() {
    await db.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }

  static async create() {
    const contact = await ContactTest.get();
    await db.address.create({
      data: {
        contact_id: contact.id,
        street: "Jalan test",
        city: "Kota test",
        province: "Provinsi test",
        country: "Indonesia",
        postal_code: "11111",
      },
    });
  }

  static async get(): Promise<Address> {
    const address = await db.address.findFirst({
      where: {
        contact: {
          username: "test",
        },
      },
    });

    if (!address) {
      throw new Error("Address is not found");
    }

    return address;
  }
}
