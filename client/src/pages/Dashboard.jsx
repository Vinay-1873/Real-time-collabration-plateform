import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspace, setNewWorkspace] = useState("");

  // 🔹 Fetch all workspaces from backend
  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("http://localhost:5000/workspaces");
      const data = await res.json();
      setWorkspaces(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Load + realtime update
  useEffect(() => {
    fetchWorkspaces();

    socket.on("workspace-updated", (data) => {
      setWorkspaces(data);
    });

    return () => {
      socket.off("workspace-updated");
    };
  }, []);

  // 🔹 Create workspace
  const createWorkspace = async () => {
    if (!newWorkspace) {
      alert("Enter workspace name");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newWorkspace }),
      });

      const data = await res.json();

      setWorkspaces(data.all); // update list
      socket.emit("workspace-change", data.all); // realtime update
      setNewWorkspace("");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Open workspace editor
  const openWorkspace = (id) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">Workspace Dashboard</h1>

      {/* Create workspace */}
      <div className="bg-white p-6 rounded shadow mb-10 w-[400px]">
        <h2 className="text-xl font-bold mb-3">Create New Workspace</h2>

        <input
          type="text"
          value={newWorkspace}
          onChange={(e) => setNewWorkspace(e.target.value)}
          placeholder="Enter workspace name"
          className="border p-2 w-full mb-3 rounded"
        />

        <button
          onClick={createWorkspace}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
        >
          Create Workspace
        </button>
      </div>

      {/* Workspace list */}
      <h2 className="text-2xl font-bold mb-4">Your Workspaces</h2>

      <div className="grid grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <div
            key={ws._id}
            className="bg-white p-6 rounded shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-bold">{ws.name}</h3>

            <button
              onClick={() => openWorkspace(ws._id)}
              className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
            >
              Open & Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}