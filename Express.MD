# Express Quick Setup (JavaScript)

Skapa en package.json

```
npm init -y

```
Installera Express

```
npm i express

```

Installera Cors

```
npm i cors

```

Lägg till följande i package.json

```
"start": "node server.js"

```

Boilerplate

```
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```




