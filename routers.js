const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const client = require("./mongodb")
const ObjectId = require("mongodb").ObjectId;

routers.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public", file.originalname);
    fs.renameSync(file.path, target);
    res.send("file berhasil diupload");
  } else {
    res.send("file gagal");
  }
});
// Routing Gambar
routers.get("/download", (req, res) => {
  const filename = "1.JPG";
  res.download(path.join(__dirname + "/assets/" + filename), "mantap.png");
});
// Routing Login
routers.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({
    status: "success",
    message: "Login page",
    data: {
      username: username,
      password: password,
    },
  });
});
routers.get("/", (req, res) => res.send("Hello World"));
routers.get("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);

// Routing mongodb
routers.get("/db", async (req, res) => {
  try {
    const db = client.db("latihan");
    const users = await db.collection("users").find().toArray();
    res.json({
      status: "success",
      message: "list users",
      data: users,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// findone
routers.get("/db/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      status: "success",
      message: "single user",
      data: user,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// insert users
routers.post("/db", async (req, res) => {
  try {
    const db = client.db("latihan");
    const result = await db.collection("users").insertOne(req.body);
    res.status(201).json({
      status: "success",
      message: "user inserted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// update users
routers.put("/db/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.status(200).json({
      status: "success",
      message: "user updated",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// delete users
routers.delete("/db/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      status: "success",
      message: "user deleted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// get orders users(join/aggregate)
routers.get("/orders", async (req, res) => {
  try {
    const db = client.db("latihan");
    const orders = await db.collection("orders").aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "user_id", 
          foreignField: "_id", 
          as: "user_data", 
        },
      },
      {
        $unwind: "$user_data", 
      },
    ]).toArray();

    res.status(200).json({
      status: "success",
      message: "list orders with user data",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = routers;