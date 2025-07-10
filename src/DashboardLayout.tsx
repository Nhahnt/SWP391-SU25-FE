import React from "react";
import DashboardSidebar from "./components/DashboardSidebar";

export default function DashboardLayout({ 
    //children 
    }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <DashboardSidebar />
            <div style={{ flex: 1, padding: '20px' }}>
                {/* {children} */}
            </div>
        </div>
    )
}