const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(express.json());
let room = "";


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.0.196:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  app.post('/create-campaign', (req, res) => {
    try {
      io.sockets.emit("receive_message", { message: req.body.message });
      res.status(200).send({ status: "OK", message: "campaign-created" })
    } catch (error) {
      res.status(500).send({ status: "server error", message: "server error" })
    }
  })

});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});