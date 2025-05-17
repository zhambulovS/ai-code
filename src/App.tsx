
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import TestPage from "./pages/TestPage";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "./providers/QueryProvider";
import AuthProvider from "./hooks/useAuth";

// ScrollToTop component to ensure pages start at the top
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Apply theme from localStorage
const applyStoredTheme = () => {
  const storedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.classList.add(storedTheme);
};

function App() {
  // Apply theme on initial render
  useEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <QueryProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="problems" element={<ProblemsPage />} />
              <Route path="problems/:id" element={<ProblemDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="edit-profile" element={<EditProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
              <Route path="courses/:courseId/tests/:testId" element={<TestPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryProvider>
  );
}

export default App;
