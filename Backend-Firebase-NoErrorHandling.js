const express = require("express");
const cors = require("cors");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* Add */

app.post("/items", async (req, res) => {
  const doc = await db.collection("items").add({
    text: req.body.text
  });

  res.json({ id: doc.id, text: req.body.text });
});

/* Read all */

app.get("/items", async (req, res) => {
  const snapshot = await db.collection("items").get();

  const items = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.json(items);
});

/* Read one */

app.get("/items/:id", async (req, res) => {
  const doc = await db.collection("items").doc(req.params.id).get();

  res.json({
    id: doc.id,
    ...doc.data()
  });
});

/* Update */

app.put("/items/:id", async (req, res) => {
  await db.collection("items").doc(req.params.id).update({
    text: req.body.text
  });

  res.json({ ok: true });
});

/* Delete */

app.delete("/items/:id", async (req, res) => {
  await db.collection("items").doc(req.params.id).delete();

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
