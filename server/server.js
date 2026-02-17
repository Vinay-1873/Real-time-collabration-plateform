const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


// ================== MONGODB CONNECT ==================
mongoose.connect("mongodb://127.0.0.1:27017/docspace", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


// ================== MODELS ==================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Document = mongoose.model("Document", documentSchema);


// ================== AUTH ==================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secret123");
  res.json({ token, user });
});


// ================== DOCUMENT ROUTES ==================

// Create new document
app.post("/create", async (req, res) => {
  const { title, content, owner } = req.body;

  const doc = new Document({
    title,
    content,
    owner,
  });

  await doc.save();
  res.json({ message: "Document created", doc });
});

// Save document (update)
app.post("/save/:id", async (req, res) => {
  const { content } = req.body;

  await Document.findByIdAndUpdate(req.params.id, {
    content: content,
  });

  res.json({ message: "Document saved" });
});

// Get all my documents
app.get("/mydocs/:email", async (req, res) => {
  const docs = await Document.find({ owner: req.params.email });
  res.json(docs);
});

// Get single document
app.get("/doc/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.json(doc);
});

// Delete document
app.delete("/delete/:id", async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


// ================== SOCKET.IO REALTIME ==================
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-document", (docId) => {
    socket.join(docId);
  });

  socket.on("send-changes", ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


// ================== START SERVER ==================
const PORT = 5000;
server.listen(PORT, () => console.log("Server running on port " + PORT));