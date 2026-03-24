import express from "express";
import cors from "cors";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = express();
app.use(cors());
app.use(express.json());


initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

/* Add */
app.post("/items", async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const doc = await db.collection("items").add({ title, description });

    return res.status(201).json({
      id: doc.id,
      title,
      description,
    });
  } catch (error) {
    console.error("POST /items error:", error);
    return res.status(500).json({ error: "Could not create item" });
  }
});

/* Read all */
app.get("/items", async (req, res) => {
  try {
    const snapshot = await db.collection("items").get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(items);
  } catch (error) {
    console.error("GET /items error:", error);
    return res.status(500).json({ error: "Could not fetch items" });
  }
});

/* Read one */
app.get("/items/:id", async (req, res) => {
  try {
    const doc = await db.collection("items").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error("GET /items/:id error:", error);
    return res.status(500).json({ error: "Could not fetch item" });
  }
});

/* Update */
app.put("/items/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (title === undefined && description === undefined) {
      return res
        .status(400)
        .json({ error: "Send at least title or description" });
    }

    const ref = db.collection("items").doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    await ref.update(updates);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("PUT /items/:id error:", error);
    return res.status(500).json({ error: "Could not update item" });
  }
});

/* Delete */
app.delete("/items/:id", async (req, res) => {
  try {
    const ref = db.collection("items").doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    await ref.delete();

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("DELETE /items/:id error:", error);
    return res.status(500).json({ error: "Could not delete item" });
  }
});


app.get("/health", (req, res) => {
  res.json({ status: "okej" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
