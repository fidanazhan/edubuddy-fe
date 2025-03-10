import { useState, useEffect } from "react";
import axios from 'axios'
import { FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next';
import api from '../../../api/axios'

const SuggestionQuestion = ({ tenantId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");
  const { t, ready } = useTranslation(["admin", "common"]);

  useEffect(() => {
    fetchQuestions();
  }, [tenantId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/suggestion-question`, {
        headers: {
          "x-tenant": subdomain,
          "Authorization": `Bearer ${token}`,
        },
      });

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
      const response = await api.post(
        "/api/suggestion-question",
        { question: newQuestion }, // Correct request payload
        {
          headers: {
            "x-tenant": subdomain,
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) { // Check response status
        setNewQuestion("");
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error saving question", error);
    }

    setLoading(false);
  };

  const handleOpenDeleteModal = (question) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };


  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;
    setLoading(true);

    try {
      const response = await api.delete(
        `/api/suggestion-question/${selectedQuestion._id}`,
        {
          headers: {
            "x-tenant": subdomain,
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchQuestions(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting question", error);
    }

    setLoading(false);
    setIsDeleteModalOpen(false);
    setSelectedQuestion(null);
  };

  if (!ready) return null;

  return (
    <div className=" dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 mb-4 dark:bg-gray-800 text-gray-900 dark:text-white">
        <h2 className="text-xl font-semibold mb-4">{t("admin:system.suggestion.title")}</h2>

        {/* Input Field */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={t("admin:system.suggestion.placeholder")}
            className="flex-1 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSaveQuestion}
            className={`px-4 py-2 rounded transition ${loading
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
              } text-white`}
            disabled={loading}
          >
            {t("common:button.save")}
          </button>
        </div>

        {/* List of Questions */}
        {loading ? (
          <div className="flex flex-col items-center h-52">
            {/* Animated Spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-600">
                  <th className="border border-gray-200 px-4 py-2">No</th>
                  <th className="border border-gray-200 px-4 py-2">{t("admin:system.suggestion.question")}</th>
                  <th className="border border-gray-200 px-4 py-2">{t("common:table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map((q, index) => (
                    <tr key={q._id} className="text-center">
                      <td className="border border-gray-200 px-4 py-2 text-sm">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{q.question}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex justify-center space-x-2">
                          <FaTrash
                            className="text-red-400 cursor-pointer"
                            onClick={() => handleOpenDeleteModal(q)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border border-gray-200 px-4 py-2 text-center">
                      {t("admin:system.suggestion.not_found_message")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}


        {/* Loading Spinner */}
        {/* {loading && (
          <div className="text-center mt-4">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )} */}
      </div>


      {isDeleteModalOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete{" "}
              <span className="text-red-500">"{selectedQuestion.question}"</span>?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Please confirm your decision.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={handleDeleteQuestion}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuggestionQuestion;
