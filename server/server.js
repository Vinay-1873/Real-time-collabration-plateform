const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


// =================== MONGODB ===================
mongoose.connect("mongodb://127.0.0.1:27017/workspaceDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// =================== SCHEMA ===================
const workspaceSchema = new mongoose.Schema({
  name: String,
  content: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Workspace = mongoose.model("Workspace", workspaceSchema);


// =================== CREATE WORKSPACE ===================
app.post("/workspace/create", async (req, res) => {
  try {
    const { name } = req.body;

    const ws = new Workspace({ name });
    await ws.save();

    const all = await Workspace.find();
    res.json({ ws, all });

  } catch (err) {
    res.status(500).json(err);
  }
});


// =================== GET ALL WORKSPACES ===================
app.get("/workspaces", async (req, res) => {
  const all = await Workspace.find();
  res.json(all);
});


// =================== GET SINGLE WORKSPACE ===================
app.get("/workspace/:id", async (req, res) => {
  const ws = await Workspace.findById(req.params.id);
  res.json(ws);
});


// =================== SAVE WORKSPACE CONTENT ===================
app.post("/workspace/save/:id", async (req, res) => {
  const { content } = req.body;

  await Workspace.findByIdAndUpdate(req.params.id, {
    content: content
  });

  res.json({ message: "Saved successfully" });
});


// =================== SOCKET REALTIME ===================
io.on("connection", (socket) => {
  console.log("User connected");

  // workspace list realtime
  socket.on("workspace-change", (data) => {
    socket.broadcast.emit("workspace-updated", data);
  });

  // join workspace room
  socket.on("join-workspace", (id) => {
    socket.join(id);
  });

  // realtime typing
  socket.on("send-changes", ({ id, content }) => {
    socket.to(id).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


// =================== SERVER ===================
const PORT = 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});