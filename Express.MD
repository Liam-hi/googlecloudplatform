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

 "type": "module",

```

Installera types för cors 

```
npm i --save-dev @types/cors

```

Boilerplate

```
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


```

En funktion i backend-miljö

```
app.post("/multiply", (req, res) => {
  const { number } = req.body;
  if (typeof number !== "number") return res.status(400).json({ error: "Invalid input" });
  res.json({ result: number * 10 });
});

```

Frontend för funktionen

```
const [result, setResult] = useState(null);

async function multiply(number) {
  const res = await fetch('http://localhost:3000/multiply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number })
  });
  const data = await res.json();
  setResult(data.result);
}

return (
  <div>
    <button onClick={() => multiply(5)}>Multiplicera 5</button>
    {result && <p>Svar: {result}</p>}
  </div>
)

```





