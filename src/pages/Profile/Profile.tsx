import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
} from "@mui/material";

export default function UserProfile() {
  // Mock dữ liệu hiển thị layout
  const user = {
    username: "john",
    email: "john@example.com",
    fullName: "John Doe",
    phone: "0987654321",
    role: "admin",
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <div className="flex items-center gap-4 mb-6">
        {/* <Avatar src="/avatar.png" sx={{ width: 56, height: 56 }} /> */}
        <div>
          <Typography variant="h5" className="font-semibold">
            {user.fullName || user.username}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Typography>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Username</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Email</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Full Name</TableCell>
              <TableCell>{user.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Phone Number</TableCell>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Role</TableCell>
              <TableCell>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
