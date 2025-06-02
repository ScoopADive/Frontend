import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

function ChatPage() {
  const { username } = useParams();

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
    setMessages([
      ...messages,
      {
        sender: "Me",
        content: message,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 줄바꿈 방지
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Chat with {username || "Unknown"}
        </h1>

        <div className="bg-white rounded-lg shadow-inner border p-4 h-72 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <p className="text-sm font-semibold text-blue-600">
                {msg.sender}{" "}
                <span className="text-xs text-gray-400">({msg.timestamp})</span>
              </p>
              <p className="text-gray-700">{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Input
            label="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown} // 🔹 Enter 키 전송 추가
          />
          <Button text="Send" onClick={handleSend} />
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;


