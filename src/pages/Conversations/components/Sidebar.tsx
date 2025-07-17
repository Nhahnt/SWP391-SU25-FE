import { useEffect, useState } from "react";
import axios from "axios";

interface Member {
  id: number;
  name: string;
  userName: string;
}

interface SidebarProps {
  onSelectMember: (memberId: number) => void;
}

const Sidebar = ({ onSelectMember }: SidebarProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const coachId = localStorage.getItem("coachId");
  console.log("coach", coachId);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8082/api/coach/${coachId}/members`
        );
        setMembers(res.data);
      } catch (err) {
        console.error("Không thể tải danh sách member", err);
      }
    };

    if (coachId) fetchMembers();
  }, [coachId]);

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r">
      <h3 className="text-lg font-semibold mb-2">Thành viên</h3>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id}>
            <button
              onClick={() => onSelectMember(member.id)}
              className="w-full text-left hover:bg-gray-200 p-2 rounded"
            >
              {member.name || member.userName}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
