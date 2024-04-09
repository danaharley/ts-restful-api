import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be create new contact", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "dana",
        last_name: "harley",
        email: "dana@nubicoder.com",
        phone: "08000",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe("dana");
    expect(response.body.data.last_name).toBe("harley");
    expect(response.body.data.email).toBe("dana@nubicoder.com");
    expect(response.body.data.phone).toBe("08000");
  });

  it("should be reject create new contact if data invalid", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "dana",
        phone: "080005498447496754958038308",
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to get contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe(contact.first_name);
    expect(response.body.data.last_name).toBe(contact.last_name);
    expect(response.body.data.email).toBe(contact.email);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it("should be reject get contact if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to update contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .patch(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "dana",
        last_name: "harliansyah",
        email: "danaharley@nubicoder.com",
        phone: "0812132",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe("dana");
    expect(response.body.data.last_name).toBe("harliansyah");
    expect(response.body.data.email).toBe("danaharley@nubicoder.com");
    expect(response.body.data.phone).toBe("0812132");
  });

  it("should be reject update contact if request invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .patch(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "danaharley",
        phone: "",
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to remove contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });

  it("should reject remove contact if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});
