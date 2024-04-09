import { Contact, User } from "@prisma/client";
import { db } from "../application/db";
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";

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

  static async checkContactMustExists(
    username: string,
    contactId: number
  ): Promise<Contact> {
    const contact = await db.contact.findFirst({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found");
    }

    return contact;
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExists(user.username, id);
    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request
    );
    await this.checkContactMustExists(user.username, updateRequest.id);

    const contact = await db.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: updateRequest,
    });

    return toContactResponse(contact);
  }
}
