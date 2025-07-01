import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useUserStore from "../store/userStore";

function ChatPage() {
  const { username } = useParams();
  const storeUser = useUserStore((state) => state.user);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "Lee",
      content: "Hey, how are you?",
      timestamp: "2025-05-18 10:25",
    },
    {
      sender: "Rim",
      content: "I’m good! Just back from a dive.",
      timestamp: "2025-05-18 10:27",
    },
  ]);

  const handleSend = () => {
    if (message.trim() === "") return;
    const me = storeUser?.name || "Me";

    setMessages([
      ...messages,
      {
        sender: me,
        content: message,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Chat with {username || "Unknown"}
        </h1>

        {/* 메시지 영역 */}
        <div className="bg-white rounded-lg shadow-inner border p-4 h-72 overflow-y-auto mb-4 space-y-3 flex flex-col">
          {messages.map((msg, idx) => {
            const isMine = msg.sender === storeUser?.name;
            return (
              <div
                key={idx}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                    isMine
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {msg.sender} • {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* 입력 영역 */}
        <div className="space-y-2">
          <Input
            label="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button text="Send" onClick={handleSend} />
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;



