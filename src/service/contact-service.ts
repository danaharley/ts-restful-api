import { User } from "@prisma/client";
import { db } from "../application/db";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-calidation";
import { Validation } from "../validation/validation";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const contactRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = { ...contactRequest, ...{ username: user.username } };

    const contact = await db.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }
}
