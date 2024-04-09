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
