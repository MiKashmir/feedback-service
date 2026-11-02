const request = require("supertest");
const { createApp } = require("../src/app");

test("відгук приймається", async () => {
  const res = await request(createApp()).post("/api/feedback").send({ lessonId: "L36", rating: 5, comment: "Корисно" });
  expect(res.status).toBe(201);
});

test.each([0, 6, 3.5, "5"])("некоректна оцінка %p — 400", async (rating) => {
  const res = await request(createApp()).post("/api/feedback").send({ lessonId: "L36", rating });
  expect(res.status).toBe(400);
});

test("середня оцінка заняття", async () => {
  const app = createApp();
  for (const rating of [5, 4, 4]) await request(app).post("/api/feedback").send({ lessonId: "L36", rating });
  const res = await request(app).get("/api/lessons/L36/summary");
  expect(res.body).toEqual({ lessonId: "L36", count: 3, average: 4.3 });
});
