import React, { useEffect, useRef, useState, Fragment } from "react";
// import { IKImage } from "imagekitio-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PromptInput from '../../component/Prompts';
import ChatResponse from '../../component/ChatResponse';
import './chatPage.css';

const ChatPage = ({ isPending, error, data }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const img2 = {
        "dbData": {},
        "aiData": {},
    }

    const endRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [data, question, answer, img.dbData]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: async (text) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/generate-stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id, // Ensure user is available
            prompt: text,
          }),
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to create chat");
        }
        return data.id; // Ensure ID is returned
      },
      onSuccess: (id) => {
        if (id) {
          queryClient.invalidateQueries({ queryKey: ["userChats"] });
          navigate(`/chats/${id}`);
        } else {
          console.error("Chat ID is missing, cannot navigate.");
        }
      },
    });
    

    const add = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: "user_2rzHVJFMuvGHRd07bO8oT0FzX4o" || undefined,
                question: text.length ? text : undefined,
                imgdb: img2["dbData"]?.filePath || undefined,
                imgai: img2["aiData"] || undefined,
            }),
        });

        let accumulatedData = "";

        if (!response.ok) {
            // Handle error (e.g., display an error message)
            return;
        }

        if (response.ok) {
            const reader = response.body.getReader();
            let isMutationCalled = false; // Flag to track if mutation.mutate() has been called

            const read = async () => {
                try {
                    const { done, value } = await reader.read();
                    if (done) {
                        reader.releaseLock();
                        setAnswer(accumulatedData);

                        // Ensure mutation.mutate() is called only once
                        if (!isMutationCalled) {
                            console.log("Calling mutation.mutate()");
                            mutation.mutate();
                            isMutationCalled = true; // Set the flag to true
                        }
                        return;
                    }
                    const decoder = new TextDecoder();
                    const chunk = decoder.decode(value);
                    accumulatedData += chunk;
                    console.log(chunk)
                    setAnswer((prevAnswer) => prevAnswer + chunk);
                    console.log("AFTER ", chunk)
                    read();
                } catch (error) {
                    console.error("Error reading stream:", error);
                    reader.releaseLock();
                }
            };
            read();
        }
    };

    const handleSubmit = async (e, message) => {
        e.preventDefault();

        const text = message;
        if (!text) return;

        img2["dbData"] = img.dbData;
        img2["aiData"] = [img.aiData];

        add(text, false);
    };

    // IN PRODUCTION WE DON'T NEED IT
    const hasRun = useRef(false);

    useEffect(() => {
        console.log("data", data);
        if (!hasRun.current) {
            if (data?.history?.length === 1) {
                add(data.history[0].parts[0].text, true);
            }
        }
        hasRun.current = true;
    }, []);

    return (
        <>
          {/* ADD NEW CHAT */}
          <div className="wrapper min-h-screen flex flex-col">
            {/* Chat Section */}
            <div className="chat flex-1 overflow-y-auto">
              {data?.history?.map((message, i) => (
                <React.Fragment key={i}>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                  >
                    <ChatResponse answer={message.parts[0].text} />
                  </div>
                </React.Fragment>
              ))}
            </div>
      
            {/* QA Section */}
            <div className="qa">
              {question && <div className="message user">{question}</div>}
              {answer && (
                <div className="message">
                  <ChatResponse answer={answer} />
                </div>
              )}
            </div>
      
            {/* Prompt Input (Bottom-fixed) */}
            <div className="flex justify-center sticky bottom-0 bg-white p-4 shadow-md">
              <PromptInput onSubmit={handleSubmit} ref={formRef} />
            </div>
      
            {/* End Chat Section */}
            <div ref={endRef}></div>
          </div>
        </>
      );
      
};

export default ChatPage;
