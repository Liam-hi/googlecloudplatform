const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
const PORT = process.env.PORT || 8080;

const storage = new Storage();
const db = new Firestore();

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

app.get('/database', async (req, res) => {
  try {
    const docRef = await db.collection('test').add({
      message: 'Firestore funkar',
      createdAt: new Date(),
    });

    res.send(`Skrev till Firestore: ${docRef.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Firestore failade');
  }
});

app.get('/', (req, res) => {
  res.send('Server funkar test test');
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
