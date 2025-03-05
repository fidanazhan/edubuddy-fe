import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const PromptInput = React.forwardRef(({ onSubmit}, ref) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(e, message); // Send the message to the parent handler
      setMessage(""); // Clear the input
    }
  };

  const handleKeyDown = (e) => {
    // Check if Enter is pressed (keyCode 13)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter key behavior (new line)
      handleSubmit(e); // Call the form submit handler
    }
  };

  return (
    <div className="flex flex-col h-5/6">

      <form
        onSubmit={handleSubmit}
        ref={ref}
        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 p-4 flex items-center space-x-4"
      >
        <div className="relative w-[60vw]">
          <textarea
            className="w-full resize-none bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 text-gray-700 dark:text-gray-300 overflow-hidden pr-10"
            placeholder={t("message2")}
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Handle keydown for Enter press
          />
          {/* Send button inside the textarea */}
          <button
            type="submit"
            className="absolute right-2 transform -translate-y-1/2 bg-gray-50 dark:bg-gray-700 text-black dark:text-gray-300 rounded-lg px-2 flex items-center justify-center"
            style={{ top: '45%' }}
            title="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>

    </div>
  );
});

export default PromptInput;