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
    <div className="flex h-[50vh] items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mt-10">
          <h1 className='font-bold text-4xl gradient-text'>Hello, {user?.name.split(" ")[0]}</h1>
        </div>

        <div className="flex justify-center mt-10">
          <h1 className='font-bold text-lg'>What I can help you with?</h1>
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          className="w-full p-4 text-black/80 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:text-white/80 dark:bg-gray-600 dark:border-gray-500 mt-10"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Dashboard;
