import React, { useState } from "react";
import { List, ListItemButton, ListItemText, Collapse, Divider } from "@mui/material";

export default function DashboardSidebar() {
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const role = localStorage.getItem('role');

  return (
    <List component="nav" sx={{ width: 260, bgcolor: '#fff7ed', height: '100%', borderRight: '2px solid #c2410c', p: 0 }}>
      {/* Dashboard */}
      <ListItemButton onClick={() => window.location.href = '#'}>
        <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600, color: '#c2410c' }} />
      </ListItemButton>
      {/* User Management */}
      <ListItemButton onClick={() => setUserMgmtOpen((open) => !open)}>
        <ListItemText primary="User Management" primaryTypographyProps={{ fontWeight: 600, color: '#c2410c' }} />
        <span style={{ marginLeft: 8 }}>{userMgmtOpen ? '▲' : '▼'}</span>
      </ListItemButton>
      <Collapse in={userMgmtOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 5 }} onClick={() => window.location.href = '#'}>
            <ListItemText primary="Member" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 5 }} onClick={() => window.location.href = '#'}>
            <ListItemText primary="Coach" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 5 }} onClick={() => window.location.href = '#'}>
            <ListItemText primary="Staff" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 5 }} onClick={() => window.location.href = '#'}>
            <ListItemText primary="Admin" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider sx={{ my: 2, borderColor: '#c2410c', opacity: 0.2 }} />
      {/* Blog Management */}
      <ListItemButton onClick={() => window.location.href = '#'}>
        <ListItemText primary="Blog Management" primaryTypographyProps={{ fontWeight: 600, color: '#c2410c' }} />
      </ListItemButton>
      {/* Feedbacks */}
      <ListItemButton onClick={() => window.location.href = '#'}>
        <ListItemText primary="Feedbacks" primaryTypographyProps={{ fontWeight: 600, color: '#c2410c' }} />
      </ListItemButton>
    </List>
  );
}
