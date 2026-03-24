# Commands

Login

```
gcloud auth login

```

Create Project

```
gcloud projects create my-asset-app

```

See All Projects

```
gcloud projects list

```

Select Project

```
gcloud config set project PROJECT_ID

```

Remove Cloud Run

```
gcloud run services delete my-project --region europe-north2

```

Deploy

```
gcloud run deploy test \
  --source . \
  --region europe-north1 \
  --allow-unauthenticated

```


Deploy / Enviroment Variable

```
gcloud run deploy fresh-start \
  --source . \
  --region europe-north1 \
  --allow-unauthenticated \
  --set-env-vars GCS_BUCKET_NAME=SECRET

```

# Bucket

Create Bucket

```
gcloud storage buckets create gs://my-asset-app13456-assets --location=europe-north1

```

See All Buckets

```
gcloud storage buckets list

```

Bucket – Quick Start

```
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

app.get('/upload', async (req, res) => {
  try {
    const file = bucket.file('test.txt');

    await file.save('Det funkar');

    res.send('Fil skapad i bucket');
  } catch (err) {
    console.error(err);
    res.status(500).send('Fel');
  }
});

```
Bucket – Test

```
echo "hej" > test.txt
gcloud storage cp test.txt gs://certain-haiku-490808-a6-hej

```

# Express Quick Start

```
1. mkdir my-node-app
2. cd my-node-app
3. npm init -y
4. touch index.js
5. npm install express

``` 

```
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Server is up');
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

``` 

# Firebase Admin Quick Start

Activate firebase API:

```gcloud services enable firestore.googleapis.com``` 

Install firebase:

```npm install firebase-admin``` 

Quick Start:

```
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

app.get('/save', async (req, res) => {
  await db.collection('items').add({ text: 'Hello' });
  res.send('Sparat!');
});

```

Firebase CRUD – Minimal, No Error Handling:

```
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

``` 

Bättre fast enkel

```
app.post("/openai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt saknas" });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: "You are an expert LinkedIn content strategist. Transform any input text into a polished, professional LinkedIn post.",
      input: prompt,
    });

    const result = response.output_text;

    // Spara i databasen
    await db.collection('items').add({
      prompt: prompt,
      result: result,
      createdAt: new Date()
    });

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "500" });
  }
});


app.get("/items", async (req, res) => {
  try {
    const snapshot = await db.collection("items").get();

    const responses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    await db.collection("items").doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

``` 
