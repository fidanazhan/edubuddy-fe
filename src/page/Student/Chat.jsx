import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import Markdown from "./Output";
import ChatResponse from "../../component/ChatResponse";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFirstMessageInSession, setIsFirstMessageInSession] = useState(false);
  const fetchCalled = useRef(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (id && !fetchCalled.current) {
      fetchCalled.current = true; // ✅ Ensures it only runs once
      fetchChatHistory();
    }
  }, [id]);

  useEffect(() => {
    console.log("Updated messages:", messages);
  }, [messages]);


  // 1️⃣ Fetch Chat History (GET)
  const fetchChatHistory = async () => {

    if (location.state?.isNew) {
      console.log("Sending first question")
      fetchCalled.current = true; // ✅ Prevent duplicate call
      setIsFirstMessageInSession(true);
      sendMessage(location.state.firstMessage);
      window.history.replaceState({}, document.title);
    }
    else {
      const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
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
        console.log(formattedWithLineBreaks)
        setMessages(formattedWithLineBreaks);

        // Check if it's a new session by detecting if it was redirected from the dashboard

      }
    }
  };



  // 2️⃣ Send User Message (PUT)
  const sendMessage = async (message) => {
    const newMessage = { role: "user", content: message || input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ question: message || input }),
    });

    setInput(""); // Clear input after sending

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
      <div className="flex flex-col items-center p-4 overflow-y-scroll" style={{ height: "80vh" }}>
        <div className="flex-1 mx-auto space-y-4 ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`}
            >
              <div
                className={`p-3 rounded-lg ${msg.role === "user"
                  ? "bg-gray-200 text-black w-4/5"
                  : "bg-white text-gray-900 w-full"
                  } max-w-xl`}
              >
                {/* <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.content}</ReactMarkdown> */}
                <Markdown>{msg.content}</Markdown>
                <ChatResponse answer={msg.content} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-4 border-t bg-white flex items-center"
        style={{ height: "20vh" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="ml-2 px-4 py-3 bg-blue-500 text-white hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );


}

export default Chat;
