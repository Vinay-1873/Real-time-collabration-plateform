import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const token = localStorage.getItem('token');
const socket = io("http://localhost:5000", { auth: { token } });

export default function Editor() {
  const { id } = useParams(); // id can be 'new' or an existing document id
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleReceive = (data) => {
      setText(data);
    };

    socket.on("receive-changes", handleReceive);

    return () => {
      socket.off("receive-changes", handleReceive);
    };
  }, []);

  useEffect(() => {
    if (id && id !== "new") {
      // load document
      (async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/doc/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const doc = await res.json();
            setText(doc.content || "");
            socket.emit('join-document', id);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const handleChange = (e) => {
    setText(e.target.value);
    if (id && id !== "new") socket.emit("send-changes", { docId: id, content: e.target.value });
  };

  const saveDoc = () => {
    (async () => {
      try {
        if (!id || id === "new") {
          // create new document
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const res = await fetch("http://localhost:5000/create", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title: "My Doc", content: text, owner: user.email || 'nandini' }),
          });
          const data = await res.json();
          const doc = data.doc;

          if (doc && doc._id) {
            socket.emit("join-document", doc._id);
            // let other clients know initial version exists
            if (data.version) socket.emit("version-created", { docId: doc._id, version: data.version });
            navigate(`/editor/${doc._id}`);
          }
        } else {
          // save existing document
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const res = await fetch(`http://localhost:5000/save/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: text, author: user.email || 'nandini' }),
          });
          await res.json();
        }

        alert("Saved");
      } catch (err) {
        console.error(err);
        alert("Save failed");
      }
    })();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Editor {loading ? '(loading...)' : ''}</h1>

      <textarea value={text} onChange={handleChange} className="w-full h-96 border p-4" />

      <button onClick={saveDoc} className="bg-green-600 text-white px-6 py-2 mt-4 rounded">
        Save Document
      </button>
    </div>
  );
}