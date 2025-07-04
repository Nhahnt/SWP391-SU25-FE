import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const usernameStr = localStorage.getItem("username");
        const response = await axios.get(
          `http://localhost:8082/api/account/${usernameStr}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (err: any) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    );
  }
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <div className="flex items-center gap-4 mb-6">
        {/* <Avatar src="/avatar.png" sx={{ width: 56, height: 56 }} /> */}
        <div>
          <Typography variant="h5" className="font-semibold">
            {user.fullName || user.username}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Role: {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
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
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
