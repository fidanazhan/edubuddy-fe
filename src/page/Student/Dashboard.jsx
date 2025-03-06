import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PromptInput from '../../component/Prompts';
import shuffle from 'lodash/shuffle';
import { useAuth } from '../../context/JWTContext';

const suggestions = [
  { name: "Help me study.", content: "vocabulary for a college entrance exam" },
  { name: "Show me a code snippet", content: "of a website's sticky header" },
  { name: "Give me ideas", content: "for what to do this evening" },
  { name: "Give me recipe", content: "for dinner" },
  { name: "Explain to me", content: "the proper way to present my project" },
  { name: "Teach me", content: "the moral conduct of using AI" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState(""); // Store user input or suggestion text

  const randomSuggestion = shuffle(suggestions).slice(0, 3);
  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user_2rzHVJFMuvGHRd07bO8oT0FzX4o" || undefined,
          text
        }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/chats/${id}`);
    },
  });

  const handleSubmit = (e, message) => {
    e.preventDefault();
    if (!message.trim()) return;
    mutation.mutate(message);
  };

  const handleSuggestionClick = (content) => {
    setInputValue(content); // Update input field with selected suggestion
  };


  return (
    <div className="flex flex-col h-[50vh] items-center">
      <div className="flex-1"></div>

      <div className="flex justify-center mt-10">
        <h1 className='font-bold text-4xl gradient-text'>Hello, {user?.name.split(" ")[0]}</h1>
      </div>

      <div className="flex justify-center mt-10">
        <h1 className='font-bold text-lg'>What I can help you with?</h1>
      </div>

      <div className="flex justify-center">
        <PromptInput onSubmit={handleSubmit} value={inputValue} onChange={setInputValue} />
      </div>
{/* 
      <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4">
        This text changes color based on the theme.
      </div> */}

      {/* Centering the suggestion list */}
      {/* <div className="flex justify-center items-center mt-10 w-full">
        <ul className="w-full max-w-md text-center">
          <div className="font-bold text-md mb-3">Suggested</div>
          {randomSuggestion.map((suggestion, index) => (
            <li 
              key={index} 
              className="mb-4 p-2 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion.content)}
            >
              <h3 className="font-semibold">{suggestion.name}</h3>
              <p className="text-gray-600">{suggestion.content}</p>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default Dashboard;
