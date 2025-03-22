import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../../api/axios'
import { useAuth } from '../../context/JWTContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken");

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
    <div className="flex h-[80vh] lg:h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="font-bold text-8xl lg:text-3xl gradient-text">
          Hello, {user?.name.split(" ")[0]}
        </h1>

        <h2 className="font-bold text-4xl lg:text-lg mt-6">
          What can I help you with?
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          className="w-full p-2 pr-4 text-black/80 text-lg lg:text-base border border-gray-300 rounded-lg shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white/80 dark:bg-gray-600 
             dark:border-gray-500 mt-10 lg:mt-6 resize-none scrollbar-hide overflow-hidden"
          rows={1} // Adjust the number of visible lines
          autoFocus
        />

      </div>
    </div>


  );
};

export default Dashboard;
