const express = require("express");
const app = express();
const port = process.env.PORT || 4001;
const { randomBytes } = require("crypto");
const { default: Axios } = require("axios");
const cors = require("cors");
require("colors");
const ServiceName = "Comments";

app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(5).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({
    content,
    commentId,
    status: "pending",
  });
  commentsByPostId[req.params.id] = comments;

  await Axios.post("http://localhost:4003/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, content, status } = data;
    const postComments = commentsByPostId[postId];
    const comment = postComments.findIndex(
      (comment) => comment.commentId === id
    );
    comment.status = status;
    Axios.post("http://localhost:4003/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        content,
        status,
      },
    });
  }
  res.send();
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
