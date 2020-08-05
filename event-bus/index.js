const express = require("express");
const app = express();
const port = process.env.PORT || 4003;
const cors = require("cors");
const { default: Axios } = require("axios");
require("colors");
const ServiceName = "Event Bus";

app.use(cors());
app.use(express.json());

app.post("/events", async (req, res) => {
  const event = req.body;
  try {
    await Axios.post("http://localhost:4000/events", event);
    await Axios.post("http://localhost:4001/events", event);
    await Axios.post("http://localhost:4002/events", event);
    await Axios.post("http://localhost:4005/events", event);
  } catch (error) {
    console.log(error);
  }
  res.send({});
});

app.listen(port, () =>
  console.log(
    `${ServiceName} Service`.yellow.bold,
    `started at port ${port}`.green.bold
  )
);
