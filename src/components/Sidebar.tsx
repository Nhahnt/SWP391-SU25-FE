import { useEffect, useState } from "react";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

export default function DashboardSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);

  const isAnyUserRouteActive = () => {
    const userPaths = [
      "/dashboard/members",
      "/dashboard/coaches",
      "/dashboard/staffs",
    ];
    return userPaths.some((path) => location.pathname === path);
  };

  useEffect(() => {
    if (isAnyUserRouteActive()) {
      setIsUsersSubMenuOpen(true);
    } else {
      setIsUsersSubMenuOpen(false);
    }
  }, [location.pathname]); 


  return (
    <ProSidebar
      rootStyles={{
        width: 220,
        minWidth: 220,
        height: "100vh",
        background: "#fff7ed",
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        borderRight: "2px solid #f3f3f3",
        borderTopRightRadius: "16px",
        paddingTop: "32px",
        paddingBottom: "16px",
      }}
    >
      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active ? "#fed7aa" : "#fff",
            color: active ? "#c2410c" : "#374151",
            margin: "0 12px",
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: active ? "bold" : "normal",
            boxShadow: active ? "0 2px 8px rgba(252,174,123,0.15)" : "none",
            "&:hover": {
              backgroundColor: "#fed7aa",
              color: "#000",
              fontWeight: "bold",
            },
          }),
        }}
      >
        <MenuItem component={<Link to="/dashboard" />} active={isActive("/dashboard")}>Overview</MenuItem>
        <SubMenu 
          label="Users"
          open={isUsersSubMenuOpen}
          onOpenChange={(open) => setIsUsersSubMenuOpen(open)}
        >
          <MenuItem component={<Link to="/dashboard/members" />} active={isActive("/dashboard/members")}>
            Members
          </MenuItem>
          <MenuItem component={<Link to="/dashboard/coaches" />} active={isActive("/dashboard/coaches")}>
            Coaches
          </MenuItem>
          <MenuItem component={<Link to="/dashboard/staffs" />} active={isActive("/dashboard/staffs")}>
            Staffs
          </MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/dashboard/feedback" />} active={isActive("/dashboard/feedback")}>
          Feedback
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}
