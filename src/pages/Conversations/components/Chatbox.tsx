import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

interface Props {
  memberId: number;
  coachId: string;
  stompClient: Client | null;
}

const ChatBox = ({ memberId, coachId, stompClient }: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const messageTopic = `/topic/chat.${memberId}.${coachId}`;

    // Subscribe to history
    const historySub = stompClient.subscribe(messageTopic, (message) => {
      const payload = JSON.parse(message.body);
      setMessages(payload); // overwrite all messages
    });

    // Gửi yêu cầu lấy lịch sử
    stompClient.publish({
      destination: "/app/chat.history",
      body: JSON.stringify({ memberId, coachId }),
    });

    // Subscribe to realtime
    const realtimeSub = stompClient.subscribe(messageTopic, (message) => {
      const payload = JSON.parse(message.body);
      setMessages((prev) => [...prev, payload]);
    });

    // Cleanup
    return () => {
      historySub.unsubscribe();
      realtimeSub.unsubscribe();
    };
  }, [stompClient, memberId, coachId]);

  const handleSend = () => {
    if (!newMessage.trim() || !stompClient || !stompClient.connected) return;

    const payload = {
      content: newMessage,
      memberId,
      coachId,
      senderIsCoach: true,
      sentAt: new Date().toISOString(),
    };

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(payload),
    });
    setMessages((prev) => [...prev, payload]);
    setNewMessage("");
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="font-bold mb-4">Chat với thành viên #{memberId}</h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.senderIsCoach ? "text-right" : "text-left"
            } text-sm`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                msg.senderIsCoach ? "bg-blue-100" : "bg-gray-200"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
