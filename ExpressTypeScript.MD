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

Installera TypeScript och typer

```
npm i -D typescript ts-node @types/express @types/cors

```

Skapa en tsconfig

```
npx tsc --init

```

Lägg till följande i package.json

```
"start": "ts-node server.ts"

```

Boilerplate

```
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

En funktion i backend-miljö

```
app.post("/multiply", (req: Request, res: Response) => {
  const { number } = req.body as { number: number };
  if (typeof number !== "number") return res.status(400).json({ error: "Invalid input" });
  res.json({ result: number * 10 });
});

```

Frontend för funktionen

```
const [result, setResult] = useState<number | null>(null);

async function multiply(number: number): Promise<void> {
  const res = await fetch('http://localhost:3000/multiply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number })
  });
  const data: { result: number } = await res.json();
  setResult(data.result);
}

return (
  <div>
    <button onClick={() => multiply(5)}>Multiplicera 5</button>
    {result && <p>Svar: {result}</p>}
  </div>
)

```

