const express = require("express");
const app = express();
const port = process.env.PORT || 4005;
const cors = require("cors");
const { default: Axios } = require("axios");
require("colors");
const ServiceName = "Moderation";

app.use(cors());
app.use(express.json());

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    setTimeout(async function () {
      const status = data.content.includes("orange") ? "rejected" : "approved";
      await Axios.post("http://localhost:4003/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    }, 10000);
  }
  res.send({});
});

app.listen(port, () =>
  console.log(
    `${ServiceName} Service`.yellow.bold,
    `started at port ${port}`.green.bold
  )
);
