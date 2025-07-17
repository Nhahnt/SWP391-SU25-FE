import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import { Client, StompSubscription } from "@stomp/stompjs";

const ChatScreen = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const currentSubRef = useRef<StompSubscription | null>(null);

  const coachId = localStorage.getItem("coachId");

  // Khởi tạo STOMP client
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8082/ws", // Đổi lại nếu URL khác
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client && client.connected) client.deactivate();
    };
  }, []);

  const handleSelectMember = (memberId: number) => {
    setSelectedMemberId(memberId);

    if (!coachId || !stompClient || !stompClient.connected) return;

    // Hủy sub cũ nếu có
    currentSubRef.current?.unsubscribe();

    const topic = `/topic/chat.${memberId}.${coachId}`;
    const subscription = stompClient.subscribe(topic, onMessageReceived);

    currentSubRef.current = subscription;
  };

  const onMessageReceived = (message: any) => {
    const body = JSON.parse(message.body);
    console.log("Received message:", body);
    // Xử lý hiển thị tin nhắn hoặc lưu vào state
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelectMember={handleSelectMember} />
      <div className="flex-1">
        {selectedMemberId ? (
          <ChatBox
            memberId={selectedMemberId}
            coachId={coachId!}
            stompClient={stompClient}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Chọn một thành viên để bắt đầu chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
