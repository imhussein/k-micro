const express = require("express");
const app = express();
const port = process.env.PORT || 4002;
const cors = require("cors");
require("colors");
const ServiceName = "Query";

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id == id);
    comment.status = status;
    comment.content = content;
  }

  res.send();
});

app.use("**", (req, res) => {
  res.status(404).send("Page not exists on server");
});

app.listen(port, () =>
  console.log(
    `${ServiceName} Service`.yellow.bold,
    `started at port ${port}`.green.bold
  )
);
