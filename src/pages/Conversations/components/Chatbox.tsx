import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

interface Message {
  id?: string | number;
  content: string;
  memberId: number;
  coachId: number;
  senderIsCoach: boolean;
  sentAt: string;
}

interface Props {
  memberId: number;
  coachId: number;
  stompClient: Client | null;
}

const ChatBox = ({ memberId, coachId, stompClient }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMember = localStorage.getItem("role") === "MEMBER";

  useEffect(() => {
    if (!stompClient) return;

    let interval: NodeJS.Timeout;
    let cleanup = () => { };

    const waitForConnection = () => {
      if (stompClient.connected) {
        subscribeAndLoad();
      } else {
        interval = setTimeout(waitForConnection, 300); // check lại sau 300ms
      }
    };

    const subscribeAndLoad = () => {
      setMessages([]);

      const topic = `/topic/chat.${memberId}.${coachId}`;
      const subscription = stompClient.subscribe(topic, (message) => {
        let payload = JSON.parse(message.body);
        if (!Array.isArray(payload)) payload = [payload];

        setMessages((prev) => {
          const newMsgs = payload.filter(
            (msg: Message) =>
              !prev.some(
                (old) => old.id === msg.id || old.sentAt === msg.sentAt
              )
          );
          return [...prev, ...newMsgs];
        });
      });

      stompClient.publish({
        destination: "/app/chat.history",
        body: JSON.stringify({ memberId, coachId }),
      });

      // Cleanup
      cleanup = () => subscription.unsubscribe();
    };

    waitForConnection();

    cleanup = () => { };
    return () => {
      clearTimeout(interval);
      cleanup();
    };
  }, [stompClient, memberId, coachId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !stompClient || !stompClient.connected) return;

    const role = localStorage.getItem("role");
    const payload: Message = {
      content: newMessage,
      memberId,
      coachId,
      senderIsCoach: role?.toLowerCase() === "coach",
      sentAt: new Date().toISOString(),
    };

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(payload),
    });

    // setMessages((prev) => [...prev, payload]);
    setNewMessage("");
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {isMember ? (
        <h2 className="font-bold mb-4">Chat với Coach #{coachId}</h2>
      ) : (
        <h2 className="font-bold mb-4">Chat với thành viên #{memberId}</h2>
      )}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => {
          const fromSelf =
            (isMember && !msg.senderIsCoach) ||
            (!isMember && msg.senderIsCoach);
          const formattedTime = new Date(msg.sentAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return (
            <div
              key={msg.id ?? idx}
              className={`text-sm ${fromSelf ? "text-right" : "text-left"
                } mb-2`}
            >
              <div
                className={`inline-block px-3 py-2 rounded ${fromSelf ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
              >
                {msg.content}
              </div>
              <div
                className={`text-xs text-gray-500 mt-1 ${fromSelf ? "text-right" : "text-left"
                  }`}
              >
                {formattedTime}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
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
