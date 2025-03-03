import { useState, useEffect } from "react";
import axios from 'axios'

const SuggestionQuestion = ({ tenantId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchQuestions();
  }, [tenantId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/suggestion-question`, {
        headers: { 
            "x-tenant": subdomain,
            "Authorization": `Bearer ${token}`,
          },
      });

      console.log("response: " + JSON.stringify(response.data))
      
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
    setLoading(false);
  };

  const handleSaveQuestion = async () => {
    if (!newQuestion.trim()) return;
    setLoading(true);

    try {
      const res = editId
        ? await fetch(`/api/suggestions/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: newQuestion }),
          })
        : await fetch("/api/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: newQuestion, tenantId }),
          });

      if (res.ok) {
        setNewQuestion("");
        setEditId(null);
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error saving question", error);
    }

    setLoading(false);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/suggestions/${id}`, { method: "DELETE" });
      if (res.ok) fetchQuestions();
    } catch (error) {
      console.error("Error deleting question", error);
    }

    setLoading(false);
  };

  const handleEditQuestion = (id, question) => {
    setNewQuestion(question);
    setEditId(id);
  };

  return (
    <div className=" dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <h2 className="text-xl font-semibold mb-4">Suggestion Questions</h2>

        {/* Input Field */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter a question..."
            className="flex-1 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSaveQuestion}
            className={`px-4 py-2 rounded transition ${
              loading
                ? "bg-gray-400 dark:bg-gray-600"
                : editId
                ? "bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400"
                : "bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
        </div>

        {/* List of Questions */}
        <ul className="mt-4 space-y-3">
          {questions.map((q) => (
            <li
              key={q._id}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded shadow-md"
            >
              <span className="text-gray-900 dark:text-gray-300">{q.question}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditQuestion(q._id, q.question)}
                  className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400 rounded text-sm text-white"
                  disabled={loading}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 dark:hover:bg-red-400 rounded text-sm text-white"
                  disabled={loading}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center mt-4">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionQuestion;
