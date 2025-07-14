import { useEffect, useState } from "react";
import "./dashboard.css";
import DashboardSidebar from "../../components/Sidebar";
import axios from "axios";

import UserGrowthChart from "./models/UserGrowthChart";
import RoleDistributionPieChart from "./models/RoleDistributionChart";
import QuitPlanPieChart from "./models/QuitPlanPieChart";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="db-sidebar">
        <DashboardSidebar />
      </div>

      <div className="db-content">
        <div style={{ padding: 32 }}>
          <h2>Dashboard Overview</h2>

          {/* Top Row - Full Width */}
          <div style={{ marginBottom: 32 }}>
            <UserGrowthChart />
          </div>

          {/* Bottom Row - Two Equal Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
          >
            <QuitPlanPieChart />
            <RoleDistributionPieChart />
          </div>
        </div>
      </div>
    </div>
  );
}
