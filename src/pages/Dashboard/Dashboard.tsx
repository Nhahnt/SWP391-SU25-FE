import { useState } from "react";
import "./dashboard.css";
interface Admin {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export default function Dashboard() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      username: "admin01",
      email: "admin01@example.com",
      fullName: "Alice Johnson",
    },
    {
      id: 2,
      username: "admin02",
      email: "admin02@example.com",
      fullName: "Bob Smith",
    },
    {
      id: 3,
      username: "admin03",
      email: "admin03@example.com",
      fullName: "Charlie Brown",
    },
  ]);

  return (
    <>
      <div className="mng-header">
        <div className="bg-[red]">Admin Management</div>
        <button className="button primary-button add-btn">
          <img src="/add-button.png" alt="add-btn" />
          <span className="font-bold">Add Admin</span>
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Admin ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>{admin.fullName}</td>
                <td>
                  <button className="action-button edit-button">Edit</button>
                  <button className="action-button delete-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
