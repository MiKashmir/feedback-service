const { createApp } = require("./app");
const { createStore } = require("./store");

const port = Number(process.env.PORT) || 3000;
createApp({ store: createStore("data/feedback.json") }).listen(port, () =>
  console.log(`feedback-service: http://localhost:${port}`),
);
