import { pool } from "../../db";
import baseRequest, { Response } from "supertest";
import app from "../app";
import { testImage } from "./helpers/testImage";

describe("Test Images CRUD", () => {
  const request = baseRequest(app);
  let res: Response;

  // Fetch images or image
  const retrieve = async (id?: string) => {
    res = await request.get(id ? `/${id}` : "/");

    const value = id ? res.body : res.body[0];

    expect(res.status).toEqual(200);
    expect(value).toHaveProperty("id");
    return value;
  };

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

  test("Test List Endpoint", async () => {
    // Get all images
    res = await request.get("/");

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("cover");
    expect(res.body[0]).toHaveProperty("thumbnail");
  });

  test("Test Create Endpoint.", async () => {
    const pic = await testImage();

    // Create a new image
    res = await request.post("/create").attach("image", pic, "2.png");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("cover");
    expect(res.body).toHaveProperty("thumbnail");

    // Fetch the image
    const result = await retrieve(res.body.id);
    expect(result.id).toEqual(res.body.id);
  });
});
