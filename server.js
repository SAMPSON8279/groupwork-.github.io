// const express = require("express");
import express from "express";
// const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";
// const path = require("path");
import path from "path";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
// const cors = require("cors");
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));


const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite database.");
});

db.run(
  `CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredient_type TEXT NOT NULL,
    quantity INTEGER NOT NULL
  )`
);


app.get("/ingredients", (req, res) => {
  db.all("SELECT * FROM ingredients", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/ingredients", (req, res) => {
    console.log("The execution got to this stage")
  const { name, ingredient_type, quantity } = req.body;
  db.run("INSERT INTO ingredients (name, ingredient_type, quantity) VALUES (?, ?, ?)", [name, ingredient_type, quantity], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, ingredient_type, quantity });
  });
});

app.put("/ingredients/:id", (req, res) => {
  const { id } = req.params;
  const { name, ingredient_type, quantity } = req.body;
  db.run("UPDATE ingredients SET name = ?, ingredient_type = ?, quantity = ? WHERE id = ?", [name, ingredient_type, quantity, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name, ingredient_type, quantity });
  });
});

app.delete("/ingredients/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM ingredients WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted", id });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;