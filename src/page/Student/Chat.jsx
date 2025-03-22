import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { chatEvents } from "./eventEmitter";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import Markdown from "./Output";
import ChatResponse from "../../component/ChatResponse";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Share2, RefreshCcw } from "lucide-react";
import { FiSend } from 'react-icons/fi'

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isFirstMessageInSession, setIsFirstMessageInSession] = useState(false);
  const fetchCalled = useRef(false);
  const token = localStorage.getItem("accessToken");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    if (inputRef.current) {
      inputRef.current.value = e.target.value; // Update ref's value
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputRef.current?.value.trim();
    if (!message) return;

    sendMessage(message);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (id) {
      fetchChatHistory();
    }
  }, [id]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset input when id changes
    }
  }, [id]);

  // useEffect(() => {
  //   // console.log("Updated messages:", messages);
  // }, [messages]);

  // 1️⃣ Fetch Chat History (GET)
  const fetchChatHistory = async () => {

    if (location.state?.isNew && !fetchCalled.current) {
      fetchCalled.current = true; // Prevent duplicate call
      setIsFirstMessageInSession(true);
      sendMessage(location.state.firstMessage);

      // ✅ Clear location.state to prevent resending on re-renders
      navigate(location.pathname, { replace: true, state: {} });
    }
    else {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + `/api/chats/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok && response.status === 200) {
          const data = await response.json();
          // Transform API response into the expected format and ensure line breaks
          const formattedMessages = await Promise.all(data.history.map((item) => ({
            role: item.role, // "user" or "assistant"
            content: item.parts.map((part) => part.text).join(" "), // Extract text from parts
          })));

          // Replace \n with Markdown-style line breaks (two spaces and then a newline)
          const formattedWithLineBreaks = await Promise.all(formattedMessages.map((msg) => ({
            ...msg,
            content: msg.content.replace(/\n/g, '  \n'), // Markdown line breaks
          })));
          setMessages(formattedWithLineBreaks);
        }
        if (response && response.status === 404) {
          console.log(`Chat did not exist!`);
          navigate("/dashboard", { replace: true }); // Redirect on 404
        }
      }
      catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`Chat did not exist!`);
          navigate("/dashboard", { replace: true }); // Redirect on 404
        } else {
          console.error("Error fetching chat:", error);
        }
      }
    }
  };



  // 2️⃣ Send User Message (PUT)
  // const sendMessage = async (message) => {
  //   const newMessage = { role: "user", content: message || inputRef.current?.value.trim() };
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);

  //   const response = await fetch(import.meta.env.VITE_API_URL + `/api/chats/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ question: message || inputRef.current?.value.trim() }),
  //   });

  //   if (response.body) {
  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     let accumulatedText = "";

  //     setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       accumulatedText += decoder.decode(value, { stream: true });
  //       setMessages((prev) =>
  //         prev.map((msg, index) =>
  //           index === prev.length - 1 ? { ...msg, content: accumulatedText } : msg
  //         )
  //       );
  //     }
  //     chatEvents.emit("refreshChats"); // ✅ Notify Sidebar to refresh
  //   }

  //   setIsFirstMessageInSession(false); // Mark session as active
  // };

  const sendMessage = async (message) => {
    const newMessage = { role: "user", content: message || inputRef.current?.value.trim() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/chats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ question: message || inputRef.current?.value.trim() }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }
  
      const data = await response.json(); // Read the entire response
      const modelResponse = data.response || "No response from AI";
  
      setMessages((prev) => [...prev, { role: "assistant", content: modelResponse }]);
  
      chatEvents.emit("refreshChats"); // ✅ Notify Sidebar to refresh
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error processing response" }]);
    }
  
    setIsFirstMessageInSession(false); // Mark session as active
  };
  


  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      {/* Chat Messages */}
      <div className="custom-scrollbar flex flex-col items-center p-4 overflow-y-scroll h-[85vh]">
        <div className="w-11/12 lg:w-4/6 lg:mx-auto flex-1 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start w-full"}`}
              onMouseEnter={() => setHoveredIndex(msg.role !== "user" ? index : null)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`p-3 rounded-lg ${msg.role === "user"
                  ? "bg-gray-200 text-black text-2xl lg:text-base w-10/12 dark:bg-gray-600 dark:text-gray-100/80"
                  : "dark:bg-gray-800 dark:text-white/90 text-gray-900 w-full"
                  } max-w-xl`}
              >

                {msg.role == "user" && (
                  <p>{msg.content}</p>
                )}

                {msg.role != "user" && (
                  <ChatResponse answer={msg.content} />
                )}

                {/* Reserved space BELOW the message for icons */}
                {msg.role !== "user" && (
                  <div className="h-9 flex">
                    <div
                      className={`flex gap-2 dark:bg-gray-800 p-1 px-4 transition-opacity duration-1000 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      <button className="p-1 hover:text-blue-500">
                        <ThumbsUp size={18} />
                      </button>
                      <button className="p-1 hover:text-red-500">
                        <ThumbsDown size={18} />
                      </button>
                      <button className="p-1 hover:text-green-500">
                        <Share2 size={18} />
                      </button>
                      <button className="p-1 hover:text-yellow-500">
                        <RefreshCcw size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-[60vw] h-[15vh] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 p-4 flex items-center space-x-4"
        >
          <div className="relative w-full lg:w-[60vw]">
            <input
              type="text"
              ref={inputRef}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full resize-none bg-gray-50 dark:bg-gray-700 rounded-lg border 
              border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none p-4 
              text-gray-700 dark:text-gray-300 overflow-hidden h-24 text-4xl lg:h-10 lg:text-base pl-5 "
            />

            <button
              type="submit"
              className="absolute right-2 transform -translate-y-1/2 bg-gray-50 dark:bg-gray-700 text-black dark:text-gray-300 rounded-lg px-2 flex items-center justify-center"
              style={{ top: '50%' }}
              title="Send message">
              <FiSend className="w-10 h-10 lg:w-5 lg:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );


}

export default Chat;
