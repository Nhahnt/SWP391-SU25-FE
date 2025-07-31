  import { useEffect, useState } from "react";
  import axios from "axios";

  interface Member {
    memberId: number;
    fullName: string;
    userName: string;
  }

  interface SidebarProps {
    onSelectMember: (memberId: number) => void;
    selectedMemberId?: number | null;
  }

  const Sidebar = ({ onSelectMember, selectedMemberId }: SidebarProps) => {
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
            `http://localhost:8082/api/coach/${coachId}/members`,
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
      <aside className="w-64 bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col h-fit">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Thành viên</h3>
        <ul className="space-y-2">
          {members.map((member, idx) => {
            const isActive = selectedMemberId === member.memberId;
            return (
              <li key={idx}>
                <button
                  onClick={() => onSelectMember(member.memberId)}
                  className={`w-full text-left p-2 rounded transition font-medium
                    ${isActive ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50 hover:text-blue-700"}
                  `}
                  aria-current={isActive ? "true" : undefined}
                >
                  {member.fullName || member.userName}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    );
  };

  export default Sidebar;
