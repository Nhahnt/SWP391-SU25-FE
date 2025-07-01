import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Blogs from "./pages/Blogs/Blogs";
import Layout from "./Layout";
import BlogDetail from "./pages/BlogDetail/PostDetail";
import CreateBlogForm from "./pages/CreateBlog/CreateBlog";
import NotFound from "./pages/NotFound/NotFound";
import UserProfile from "./pages/Profile/Profile";
import CreateQuitPlan from "./pages/QuitPlan/QuitPlan";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/create-blog" element={<CreateBlogForm />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/quit-plan" element={<CreateQuitPlan />} />
          <Route path="*" element={<NotFound />} />
          {/* 👈 route động */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
