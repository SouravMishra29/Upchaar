import { useState, useEffect } from "react";
import { fetchRecords, deleteRecord } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function RecordsSection() {
  const { isAuthenticated } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadRecords();
  }, [isAuthenticated]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await fetchRecords();
      if (data.success) {
        setRecords(data.records);
      } else {
        setError("Failed to load records.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete record.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-200">Previous Records</h2>
        <p className="mt-4 text-gray-400">Please log in to view your chat history.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Previous Records</h2>

      {loading && <p className="text-gray-400 animate-pulse">Loading records...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && records.length === 0 && (
        <p className="text-gray-400">No records yet. Start a chat to create your first record.</p>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {records.map((record) => (
          <div
            key={record._id}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {record.symptoms.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs capitalize">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpanded(expanded === record._id ? null : record._id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  {expanded === record._id ? "Hide" : "View"}
                </button>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {expanded === record._id && (
              <div className="mt-3 pt-3 border-t dark:border-gray-700 space-y-2">
                {record.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`px-3 py-2 rounded-lg text-xs max-w-[80%] whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecordsSection;
