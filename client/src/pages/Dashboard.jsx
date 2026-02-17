import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">

        {/* Create new document */}
        <div 
          onClick={() => navigate("/editor/new")}
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-xl font-bold">Create New Document</h2>
          <p className="text-gray-500">Start editing new doc</p>
        </div>

        {/* Upload */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold">Upload Document</h2>
          <input type="file" className="mt-3" />
        </div>

        {/* View docs */}
        <div 
          onClick={() => navigate("/editor/123")}
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-xl font-bold">View & Edit Documents</h2>
          <p className="text-gray-500">Open saved docs</p>
        </div>

      </div>
    </div>
  );
}