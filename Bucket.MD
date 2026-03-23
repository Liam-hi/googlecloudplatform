# Bucket

Skapa en Bucket

```
gcloud storage buckets create gs://my-asset-app13456-assets --location=europe-north1

```
Samtliga Buckets i GCP

```
gcloud storage buckets list

```

Quick Guide

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

Test

```
echo "hej" > test.txt
gcloud storage cp test.txt gs://certain-haiku-490808-a6-hej


```

Ladda upp en fil

```
npm i multer

```

Multer - Quick Start

```
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
    credential: applicationDefault(),
});

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 8080;

const storage = new Storage();
const db = getFirestore();

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('Ingen fil');

        const name = req.file.originalname;

        await bucket.file(name).save(req.file.buffer);

        const url = `https://storage.googleapis.com/${bucket.name}/${name}`;

        const doc = await db.collection('assets').add({
            title: req.body.title,
            platform: req.body.platform,
            url,
        });

        res.json({
            id: doc.id,
            url,
            title: req.body.title,
            platform: req.body.platform,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Fail');
    }
});

app.get('/assets', async (_, res) => {
    try {
        const snapshot = await db.collection('assets').get();
        res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunde inte hämta assets' });
    }
});

app.get('/', (req, res) => {
    res.send(bucket.name);
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

```

Kör

```
gcloud run deploy fresh-start \
  --source . \
  --region europe-north1 \
  --allow-unauthenticated \
  --set-env-vars GCS_BUCKET_NAME=SECRET


```

