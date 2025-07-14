import { useState } from "react";
import "./dashboard.css";
import DashboardSidebar from "../../components/Sidebar";

interface Admin {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="db-sidebar">
        <DashboardSidebar />
      </div>
      <div className="db-content">
        <div className="content-header" style={{}}>
          <div className="bg-[red]">Welcome to Administration Dashboard</div>
        </div>
      </div>
    </div>
  );
}
