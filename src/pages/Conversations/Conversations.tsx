import React, { useState } from "react";
import Card from "../../components/shared/Card";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
} from "@mui/material";

// Dữ liệu các liên hệ
const contacts = [
  { id: 1, name: "Alice Johnson", lastMessage: "Hey there!" },
  { id: 2, name: "Bob Smith", lastMessage: "Let's catch up." },
  { id: 3, name: "Charlie Tran", lastMessage: "Okay, noted!" },
];

export function Conversations() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lọc contacts dựa trên từ khóa tìm kiếm
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-[85vh] flex flex-row">
      <Card className="w-[15%]  overflow-y-auto">
        <Typography variant="h6" fontWeight="bold" color="#c2410c">
          Contacts
        </Typography>

        {/* Thanh tìm kiếm */}
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị tìm kiếm
          sx={{ marginBottom: 2 }}
        />

        {/* Danh sách các liên hệ đã lọc */}
        <List>
          {filteredContacts.map((contact) => (
            <ListItem
              key={contact.id}
              onClick={() => setSelectedId(contact.id)}
              className={`hover:bg-gray-100 hover:cursor-pointer ${
                selectedId === contact.id ? "bg-gray-200" : ""
              }`} // Thêm class 'bg-gray-200' khi mục được chọn
              component="li"
            >
              <ListItemText
                primary={contact.name}
                secondary={contact.lastMessage}
                primaryTypographyProps={{ fontWeight: "500" }}
              />
            </ListItem>
          ))}
        </List>
      </Card>

      <Card className="flex-1 bg-white h-full p-4 flex flex-col justify-between">
        {selectedId ? (
          <>
            {/* Tiêu đề */}
            <Typography variant="h6" gutterBottom>
              Chatting with{" "}
              <strong>{contacts.find((c) => c.id === selectedId)?.name}</strong>
            </Typography>

            {/* Nội dung chat - giả lập bằng Box rỗng */}
            <Box className="flex-1 overflow-y-auto mb-4 border rounded-md p-2">
              {/* Hiện tin nhắn ở đây (sau này) */}
              <Typography variant="body2" color="text.secondary">
                (Conversation will appear here...)
              </Typography>
            </Box>

            {/* Input + Gửi */}
            <Box className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <button className="px-4 py-2 bg-[#c2410c] text-white rounded-md hover:bg-[#a6360a]">
                Send
              </button>
            </Box>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Select a contact to start chatting.
          </Typography>
        )}
      </Card>
    </div>
  );
}
