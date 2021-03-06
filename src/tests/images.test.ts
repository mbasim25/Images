import { pool } from "../../db";
import baseRequest, { Response } from "supertest";
import app from "../app";
import { testImage } from "./helpers/testImage";

describe("Test Images CRUD", () => {
  const request = baseRequest(app);
  let res: Response;

  // Fetch image(s)
  const retrieve = async (id?: string) => {
    res = await request.get(id ? `/${id}` : "/");

    const value = id ? res.body : res.body[0];

    expect(res.status).toEqual(200);
    expect(value).toHaveProperty("id");
    return value;
  };

  beforeAll(async () => {
    pool.query(`TRUNCATE TABLE images;`);
  });

  beforeEach(async () => {
    const pic = await testImage();

    // create an image
    await request.post("/create").attach("image", pic, "1.png");
  });

  afterEach(async () => {
    pool.query(`TRUNCATE TABLE images;`);
  });

  test("Test Retrieve Endpoint", async () => {
    // Get the id of an image
    const { id } = await retrieve();

    // Get an image by id
    const res = await request.get(`/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("cover");
    expect(res.body).toHaveProperty("thumbnail");
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
  });

  test("Test Update Endpoint", async () => {
    const pic = await testImage();

    // Get the id of an image
    const { id } = await retrieve();

    // Update
    res = await request.patch(`/${id}`).attach("image", pic, "3.png");
    expect(res.status).toBe(200);
    expect(res.body.cover).toContain("3.png");
    expect(res.body).toHaveProperty("thumbnail");
    expect(res.body).toHaveProperty("id");
  });

  test("Test Delete Endpoint", async () => {
    // Get the id of an image
    const { id } = await retrieve();

    // Delete
    res = await request.delete(`/${id}`);
    expect(res.status).toBe(204);

    // Check that the image was deleted
    const result = await request.get(`/${id}`);
    expect(result.status).toEqual(404);
  });
});
