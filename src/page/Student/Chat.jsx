import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFirstMessageInSession, setIsFirstMessageInSession] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (id) {
      fetchChatHistory();
    }
  }, [id]);

  // 1️⃣ Fetch Chat History (GET)
  const fetchChatHistory = async () => {
    const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Transform API response into the expected format
      const formattedMessages = data.history.map((item) => ({
        role: item.role, // "user" or "assistant"
        content: item.parts.map((part) => part.text).join(" "), // Extract text from parts
      }));

      setMessages(formattedMessages);

      console.log("Location State: " + JSON.stringify(location.state))

      // ✅ Check if it's a new session by detecting if it was redirected from the dashboard
      if (location.state?.isNew) {
        console.log("Masuk sini")
        setIsFirstMessageInSession(true);
        sendMessage(location.state.firstMessage);
      }
    }
  };
  
  

  // 2️⃣ Send User Message (PUT)
  const sendMessage = async (message) => {
    const newMessage = { role: "user", content: message || input };
    setMessages([...messages, newMessage]);

    const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ text: message || input }),
    });

    setInput(""); // Clear input after sending

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1), // Replace last assistant message to simulate real-time
          { role: "assistant", content: accumulatedText },
        ]);
      }
    }

    setIsFirstMessageInSession(false); // Mark session as active
  };
  

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center text-lg font-semibold">
        Chat {id}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-3 max-w-xs rounded-lg ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-900 border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 border-t bg-white flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="ml-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
