import { Outlet, useNavigate } from "react-router-dom";

import AppBreadcrumbs from "./components/shared/BreadCrumbs";
import Header from "./components/Header";

// import Header, Sidebar, Footer nếu cần

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header dùng chung */}
      {/* <header className="p-4 shadow-md text-white bg-[#c2410c]">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer hover:underline transition"
        >
          My App
        </h1>
      </header> */}
      <Header />
      {/* Content */}
      <main className="flex-1 space-y-2">
        <Outlet />
      </main>

      {/* Footer dùng chung (nếu có) */}
      <footer className="mt-4 p-4 flex justify-center items-center text-sm text-white bg-[#c2410c] min-h-[7vh]">
        &copy; {new Date().getFullYear()} My App
      </footer>
    </div>
  );
}
