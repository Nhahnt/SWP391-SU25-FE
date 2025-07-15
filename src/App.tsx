import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";
import Register from "./pages/Auth/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Blogs from "./pages/Blogs/Blogs";
import BlogDetail from "./pages/BlogDetail/PostDetail";
import CreateBlogForm from "./pages/CreateBlog/CreateBlog";
import NotFound from "./pages/NotFound/NotFound";
import UserProfile from "./pages/Profile/Profile";
import CreateQuitPlan from "./pages/QuitPlan/QuitPlan";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import MoodTracker from "./components/MoodTracker";
import QuitPlanDetail from "./pages/QuitPlan/QuitPlanDetail";
import { ProgressTracking } from "./pages/ProgressTracking/ProgressTracking";
import { Conversations } from "./pages/Conversations/Conversations";
import CoachDashboard from "./pages/CoachDashboard/CoachDashboard";
import MembersList from "./pages/Dashboard/Members/MembersList";
import CoachesList from "./pages/Dashboard/Coaches/CoachesList";
import StaffsList from "./pages/Dashboard/Staffs/StaffsList";
import Feedback from "./pages/Dashboard/Feedback/Feedback";

export default function App() {
  return (
    <BrowserRouter>
      <MoodTracker />

      <Routes>
        {/* Auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/quit-plan" element={<CreateQuitPlan />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/members"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <MembersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coaches"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <CoachesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staffs"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <StaffsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/feedback"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/quit-plan"
            element={
              <ProtectedRoute allowedRoles={["member", ""]}>
                <CreateQuitPlan />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff", "member"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-blog"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff", "member"]}>
                <CreateBlogForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach-dashboard"
            element={
              <ProtectedRoute allowedRoles={["coach"]}>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
