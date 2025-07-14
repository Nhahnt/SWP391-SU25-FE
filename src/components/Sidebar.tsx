import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

export default function DashboardSidebar() {
    return (
<ProSidebar>
  <Menu 
    menuItemStyles={{
      subMenuContent: {
        [`&.active`]: {
          backgroundColor: '#c2410c',
          color: '#fff',
        },
        [`&.hover`]: {
          backgroundColor: '#c2410c',
          color: '#fff',
        },
      },
    }
  }>
    <MenuItem component={<Link to="/dashboard" />}>Overview</MenuItem>
    <SubMenu label="Users">
      <MenuItem component={<Link to="/dashboard/members" />}>Members</MenuItem>
      <MenuItem component={<Link to="/dashboard/coaches" />}>Coaches</MenuItem>
      <MenuItem component={<Link to="/dashboard/staffs" />}>Staffs</MenuItem>
      <MenuItem component={<Link to="/dashboard/admins" />}>Admins</MenuItem>
    </SubMenu>
    <MenuItem component={<Link to="/dashboard/feedback" />}> Feedback </MenuItem>
  </Menu>
</ProSidebar>
    );
}
