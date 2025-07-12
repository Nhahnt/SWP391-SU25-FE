import { Outlet, useNavigate } from "react-router-dom";

import AppBreadcrumbs from "./components/shared/BreadCrumbs";
import Header from "./components/Header";

// import Header, Sidebar, Footer nếu cần

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Content */}
      <main className="flex-1 space-y-2 h-[85vh] bg-neutral-100">
        <Outlet />
      </main>

      {/* Footer dùng chung (nếu có) */}
      <footer className="p-4 flex justify-center items-center text-sm text-white bg-[#c2410c] h-5vh]">
        &copy; {new Date().getFullYear()} My App
      </footer>
    </div>
  );
}
