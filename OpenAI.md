# OpenAI Quick Setup

Installering

```
npm install openai dotenv
```
Från OpenAI:s dokumentation

```
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/openai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt saknas" });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    res.json({ result: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "500" });
  }
});

```

.env

```
OPENAI_API_KEY=

```
