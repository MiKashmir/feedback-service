const express = require("express");
const { createStore } = require("./store");

/** Перевіряє відгук за вимогами REQUIREMENTS.md; повертає текст помилки або null */
function validate({ lessonId, rating, comment }) {
  if (typeof lessonId !== "string" || lessonId.trim() === "") return "Не вказано заняття";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "Оцінка має бути цілим числом від 1 до 5";
  if (comment !== undefined && (typeof comment !== "string" || comment.length > 500)) {
    return "Коментар — рядок до 500 символів";
  }
  return null;
}

function createApp({ store = createStore() } = {}) {
  const app = express();
  app.use(express.json());

  app.post("/api/feedback", async (req, res, next) => {
    try {
      const error = validate(req.body);
      if (error) return res.status(400).json({ error });
      const { lessonId, rating, comment = "" } = req.body;
      await store.add({ lessonId, rating, comment, createdAt: new Date().toISOString() });
      res.status(201).json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/lessons/:id/summary", (req, res) => {
    const ratings = store.all().filter((f) => f.lessonId === req.params.id).map((f) => f.rating);
    const average = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;
    res.json({ lessonId: req.params.id, count: ratings.length, average });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  });

  return app;
}

module.exports = { createApp, validate };
