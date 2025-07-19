import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import { Client, StompSubscription } from "@stomp/stompjs";

const ChatScreen = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
    () => {
      const stored = localStorage.getItem("memberId");
      return stored ? parseInt(stored, 10) : null;
    }
  );

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const currentSubRef = useRef<StompSubscription | null>(null);

  const coachId = localStorage.getItem("coachId");
  const role = localStorage.getItem("role");

  // Initialize STOMP client
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8082/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        console.log("Connected to WebSocket");
      },
      onStompError: (frame) => {
        console.error("Broker error: " + frame.headers["message"]);
        console.error("Details: " + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client && client.connected) client.deactivate();
    };
  }, []);

  // Handle member selection
  const handleSelectMember = useCallback(
    (memberId: number) => {
      setSelectedMemberId(memberId);
      localStorage.setItem("memberId", memberId.toString());

      if (!coachId || !stompClient || !stompClient.connected) return;

      // Unsubscribe previous
      currentSubRef.current?.unsubscribe();

      // Subscribe to new topic
      const topic = `/topic/chat.${memberId}.${coachId}`;
      currentSubRef.current = stompClient.subscribe(topic, () => {});
    },
    [coachId, stompClient]
  );

  return (
    <div className="chat-screen-container">
      {(role === "coach" || role === "COACH") && (
        <Sidebar onSelectMember={handleSelectMember} />
      )}
      <div className="flex-1">
        {selectedMemberId ? (
          <ChatBox
            memberId={selectedMemberId}
            coachId={coachId ? parseInt(coachId, 10) : 0}
            stompClient={stompClient}
          />
        ) : (
          <div className="chat-placeholder">
            Chọn một thành viên để bắt đầu chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;