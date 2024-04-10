import { Contact, User } from "@prisma/client";
import { db } from "../application/db";
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

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

  static async remove(user: User, id: number) {
    await this.checkContactMustExists(user.username, id);

    const contact = await db.contact.delete({
      where: {
        id,
        username: user.username,
      },
    });

    return toContactResponse(contact);
  }

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    const searchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request
    );

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = [];

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: { contains: searchRequest.name },
          },
          {
            last_name: { contains: searchRequest.name },
          },
        ],
      });
    }

    if (request.email) {
      filters.push({
        email: { contains: searchRequest.email },
      });
    }

    if (request.phone) {
      filters.push({
        phone: { contains: searchRequest.phone },
      });
    }

    const contacts = await db.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await db.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
