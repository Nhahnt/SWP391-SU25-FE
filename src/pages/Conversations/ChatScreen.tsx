import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import { Client, StompSubscription } from "@stomp/stompjs";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import MemberCheck from "./components/MemberCheck";

const ChatScreen = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
    () => {
      const stored = localStorage.getItem("memberId");
      return stored ? parseInt(stored, 10) : null;
    }
  );

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false); // State to track WebSocket connection status
  const currentSubRef = useRef<StompSubscription | null>(null); // Ref to hold the current STOMP subscription

  const coachId = localStorage.getItem("coachId"); 
  const role = localStorage.getItem("role"); 

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8082/ws", // WebSocket broker URL
      reconnectDelay: 5000, // Delay before attempting to reconnect
      onConnect: () => {
        setIsConnected(true); // Set connection status to true on successful connect
        console.log("Connected to WebSocket");
      },
      onStompError: (frame) => {
        console.error("Broker error: " + frame.headers["message"]);
        console.error("Details: " + frame.body);
      },
    });

    client.activate(); 
    setStompClient(client);

    // Cleanup function: deactivate STOMP client when the component unmounts
    return () => {
      if (client && client.connected) client.deactivate();
    };
  }, []);

  const handleSelectMember = useCallback(
    (memberId: number) => {
      setSelectedMemberId(memberId); 
      localStorage.setItem("memberId", memberId.toString());

      // If no coach ID, no STOMP client, or client not connected, return early
      if (!coachId || !stompClient || !stompClient.connected) return;

      // Unsubscribe from the previous topic if a subscription exists
      currentSubRef.current?.unsubscribe();

      // Subscribe to the new chat topic for the selected member and coach
      const topic = `/topic/chat.${memberId}.${coachId}`;
      currentSubRef.current = stompClient.subscribe(topic, () => {}); // Subscribe without a message handler for now
    },
    [coachId, stompClient] 
  );

  return (
    <MemberCheck>
      <div className="flex min-h-[80vh] bg-gray-50 rounded-lg shadow p-4 gap-4 max-w-7xl mx-auto mt-6">
        {(role === "coach" || role === "COACH") && (
          <Sidebar onSelectMember={handleSelectMember} selectedMemberId={selectedMemberId} />
        )}
          
        <div className="flex-1 flex flex-col">
          {/* Coach Navigation Button - visible only to coaches */}
          {(role === "coach" || role === "COACH") && (
            <div className="mb-4 flex justify-end">
              <Link to="/coach-tracking">
                <Button
                  variant="contained"
                  startIcon={<AssessmentIcon />}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Track Progress
                </Button>
              </Link>
            </div>
          )}
          
          <div className="flex-1 flex items-center justify-center">
            {selectedMemberId ? (
              // Render ChatBox if a member is selected
              <ChatBox
                memberId={selectedMemberId}
                coachId={coachId ? parseInt(coachId, 10) : 0}
                stompClient={stompClient}
              />
            ) : (
              // Display a message if no member is selected
              <div className="text-gray-400 text-lg font-medium text-center">
                Chọn một thành viên để bắt đầu chat
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberCheck>
  );
};

export default ChatScreen;
