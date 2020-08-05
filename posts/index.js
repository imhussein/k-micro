const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const { default: Axios } = require("axios");
const cors = require("cors");
const { randomBytes } = require("crypto");
require("colors");
const ServiceName = "Posts";

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  const id = randomBytes(4).toString("hex");
  posts[id] = {
    title,
    id,
  };
  await Axios.post("http://localhost:4003/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  res.send({});
});

app.use("**", (req, res) => {
  res.status(404).send("Page not exists on server");
});

app.listen(port, () => {
  console.log(
    `${ServiceName} Service`.yellow.bold,
    `started at port ${port}`.green.bold
  );
});
