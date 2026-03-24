"use client"

import React from 'react'
import { useState, useEffect } from 'react'

function Fetch() {
    const [items, setItems] = useState([])
    const [newText, setNewText] = useState("")

    async function fetchData() {
        const res = await fetch("/items");
        const data = await res.json();
        setItems(data);
    }

    useEffect(() => {
        fetchData();
    }, [])

    async function createItem(event) {
        await fetch("/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: newText }),
        })

        setNewText("")
        fetchData()
    }

    async function deleteItem(id) {
        await fetch(`/${id}`, {
            method: "DELETE",
        })

        fetchData()
    }

    async function editItem(id, currentText) {
        const updatedText = window.prompt("Edit item text", currentText)

        if (updatedText === null) {
            return
        }

        await fetch(`/items/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: updatedText }),
        })

        fetchData()
    }


    return (
        <div>
            {items.map((item) => (
                <li key={item.id}>
                    <p>{item.text}</p>
                    <button onClick={() => editItem(item.id, item.text)}>Edit</button>
                    <button onClick={() => deleteItem(item.id)}>Delete</button>
                </li>
            ))}

            <input
                value={newText}
                onChange={(event) => setNewText(event.target.value)}
                placeholder="New item text"
            />
            <button onClick={createItem} type="submit">Create</button>
        </div>
    )
}

export default Fetch
