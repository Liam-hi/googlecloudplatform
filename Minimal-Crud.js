"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  async function loadItems() {
    const res = await fetch("/items");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function addItem() {
    await fetch("/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    setText("");
    loadItems();
  }

  async function deleteItem(id) {
    await fetch(`/${id}`, {
      method: "DELETE"
    });

    loadItems();
  }

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Skriv något"
      />

      <button onClick={addItem}>Add</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => deleteItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
