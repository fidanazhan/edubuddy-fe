import React from 'react'
import { useOutletContext, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PromptInput from '../../component/Prompts';
import ChatPage from './ChatPage';

const Chat = () => {
    const { selectedModel } = useOutletContext(); // Access the context

    const path = useLocation().pathname;
    const chatId = path.split("/").pop();

    const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}?userId=user_2rzHVJFMuvGHRd07bO8oT0FzX4o`, {
            }).then((res) => res.json()),
    });
    console.log(data);
    // const handleSubmit = (message) => {
    //     console.log("Message submitted:", message);
    //     // Handle message submission logic here (e.g., send to API, update state, etc.)
    // };

    
    return (
        <div className="flex flex-col h-[80vh]"> {/* Full screen height */}
            <div className="flex-1 flex items-center justify-center"> {/* Center content */}
                {isPending
                ? "Loading..."
                : error
                ? "Something went wrong!"
                : (
                    <ChatPage
                    isPending={isPending}
                    error={error}
                    data={data}
                    />
                )
                }
            </div>
            {/* Add some margin to the bottom of the PromptInput */}
            {/* <div className="flex justify-center"> 
                <PromptInput onSubmit={handleSubmit} />
            </div> */}
        </div>

    )
}

export default Chat;