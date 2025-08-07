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
      "/dashboard/feedback",
    ];
    return userPaths.some((path) => location.pathname.startsWith(path));
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
        height: "calc(100vh - 70px)",
        background: "#c2410c",
        boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
        borderRight: "2px solid #a3330b",
        paddingTop: "32px",
        paddingBottom: "16px",
        overflowX: "auto",
      }}
    >
      <Menu>
        <MenuItem
          component={<Link to="/dashboard" />}
          active={isActive("/dashboard")}
        >
          Overview
        </MenuItem>
        <SubMenu
          label="Users"
          open={isUsersSubMenuOpen}
          onOpenChange={(open) => setIsUsersSubMenuOpen(open)}
        >
          <MenuItem
            component={<Link to="/dashboard/members" />}
            active={isActive("/dashboard/members")}
          >
            Members
          </MenuItem>
          <MenuItem
            component={<Link to="/dashboard/coaches" />}
            active={isActive("/dashboard/coaches")}
          >
            Coaches
          </MenuItem>
          <MenuItem
            component={<Link to="/dashboard/staffs" />}
            active={isActive("/dashboard/staffs")}
          >
            Staffs
          </MenuItem>
        </SubMenu>
        <MenuItem
          component={<Link to="/dashboard/feedback" />}
          active={isActive("/dashboard/feedback")}
        >
          Feedback
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}