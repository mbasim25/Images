import { pool } from "../../db";
import baseRequest, { Response } from "supertest";
import app from "../app";
import { testImage } from "./helpers/testImage";

describe("Test Images CRUD", () => {
  const request = baseRequest(app);
  let res: Response;

  beforeEach(async () => {
    const pic = await testImage();

    // image 1
    await request.post("/create").attach("image", pic, "1.png");
  });

  afterEach(async () => {
    pool.query(`TRUNCATE TABLE images;`);
  });

  test("Test Retrieve Endpoint", async () => {
    // Get all images
    const results = await request.get("/");
    const { id } = results.body[0];

    // Get an image by id
    const res = await request.get(`/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("cover");
    expect(res.body).toHaveProperty("thumbnail");
    expect(res.body.cover).toContain(".png");
  });
});
