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

app.get('/save', async (req, res) => {
    await db.collection('items').add({ text: 'hej' });
    res.send('Sparat!');
});


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


/* app.get('/assets', async (_, res) => {
    try {
        const snapshot = await db.collection('assets').get();
        res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunde inte hämta assets' });
    }
}); */

app.get('/assets', async (req, res) => {
    try {
        const { platform } = req.query;

        let query = db.collection('assets');

        if (platform) {
            query = query.where('platform', '==', platform);
        }

        const snapshot = await query.get();

        res.json(
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunde inte hämta assets' });
    }
});

app.delete('/assets/:id', async (req, res) => {
  try {
    await db.collection('assets').doc(req.params.id).delete();
    res.send('Deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Fail');
  }
});

app.get('/', (req, res) => {
    res.send(bucket.name);
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

