import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import Markdown from "./Output";
import ChatResponse from "../../component/ChatResponse";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Share2, RefreshCcw } from "lucide-react";

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
        const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok && response.status === 200) {
          const data = await response.json();
          // console.log(data)
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
          // console.log(formattedWithLineBreaks)
          setMessages(formattedWithLineBreaks);

          // Check if it's a new session by detecting if it was redirected from the dashboard

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
  const sendMessage = async (message) => {
    const newMessage = { role: "user", content: message || inputRef.current?.value.trim() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ question: message || inputRef.current?.value.trim() }),
    });

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, content: accumulatedText } : msg
          )
        );
      }
    }

    setIsFirstMessageInSession(false); // Mark session as active
  };


  return (
    <div className="flex flex-col mx-auto h-[calc(100vh-100px)] overflow-hidden">
      {/* Chat Messages */}
      <div className="flex flex-col items-center p-4 overflow-y-scroll" style={{ height: "85vh" }}>
        <div className="flex-1 mx-auto space-y-4 ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              onMouseEnter={() => setHoveredIndex(msg.role !== "user" ? index : null)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`p-3 rounded-lg ${msg.role === "user"
                  ? "bg-gray-200 text-black w-4/5 dark:bg-gray-600 dark:text-gray-100/80"
                  : "bg-white dark:bg-gray-800 dark:text-white/90 text-gray-900 w-full"
                  } max-w-xl`}
              >
                {/* Message Content */}
                <ChatResponse answer={msg.content} />

                {/* Reserved space BELOW the message for icons */}
                {msg.role !== "user" && (
                  <div className="h-8 flex">
                    <div
                      className={`flex gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg shadow transition-opacity duration-1000 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
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

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex items-center dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300/80"
        style={{ height: "15vh" }}
      >
        <input
          type="text"
          ref={inputRef}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300/80 rounded-lg"
        />

        <button type="submit" className="ml-2 px-4 py-3 bg-blue-500 text-white hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );


}

export default Chat;
