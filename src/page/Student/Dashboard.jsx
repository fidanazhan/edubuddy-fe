import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../api/axios'

const Dashboard = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken");

  // const handleKeyDown = async (e) => {
  //   if (e.key === "Enter" && text.trim() !== "") {
  //     const response = await fetch("http://localhost:5000/api/chats", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ text }),
  //     });

  //     const { chatId } = await response.json();
  //     if (chatId) {
  //       navigate(`/chats/${chatId}`, { state: { isNew: true, firstMessage: text } }); // ✅ Pass flag
  //     }
  //   }
  // };

  const createChatMutation = useMutation({
    mutationFn: async (text) => {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to create chat");

      return response.json(); // Returns { chatId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userChats"]); // Refresh sidebar
      navigate(`/chats/${data.chatId}`, { state: { isNew: true, firstMessage: text } });
    },
  });

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && text.trim() !== "") {
      createChatMutation.mutate(text);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-xl">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          className="w-full p-4 text-black/80 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:text-white/80 dark:bg-gray-600 dark:border-gray-500"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Dashboard;
