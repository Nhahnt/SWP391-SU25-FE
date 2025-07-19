  import { useEffect, useState } from "react";
  import axios from "axios";

  interface Member {
    memberId: number;
    fullName: string;
    userName: string;
  }

  interface SidebarProps {
    onSelectMember: (memberId: number) => void;
  }

  const Sidebar = ({ onSelectMember }: SidebarProps) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const coachId = localStorage.getItem("coachId");
    const token = localStorage.getItem("token");

    useEffect(() => {
      const fetchMembers = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:8082/api/coaches/${coachId}/members`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          setMembers(res.data);
        } catch (err) {
          setError("Không thể tải danh sách thành viên");
          console.error("Không thể tải danh sách member", err);
        } finally {
          setLoading(false);
        }
      };

      if (coachId) fetchMembers();
    }, [coachId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h3 className="text-lg font-semibold mb-2">Thành viên</h3>
        <ul className="space-y-2">
          {members.map((member, idx) => (
            <li key={idx}>
              <button
                onClick={() => onSelectMember(member.memberId)}
                className="w-full text-left hover:bg-gray-200 p-2 rounded"
              >
                {member.fullName || member.userName}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    );
  };

  export default Sidebar;
