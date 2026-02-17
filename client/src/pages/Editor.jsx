import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Editor() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receive-changes", (data) => {
      setText(data);
    });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("send-changes", { docId: "123", content: e.target.value });
  };

  const saveDoc = () => {
    fetch("http://localhost:5000/create", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        title: "My Doc",
        content: text,
        owner: "nandini"
      })
    });

    alert("Saved");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Editor</h1>

      <textarea
        value={text}
        onChange={handleChange}
        className="w-full h-96 border p-4"
      />

      <button 
        onClick={saveDoc}
        className="bg-green-600 text-white px-6 py-2 mt-4 rounded"
      >
        Save Document
      </button>
    </div>
  );
}