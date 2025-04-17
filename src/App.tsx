
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
import LeaderboardPage from "./pages/LeaderboardPage";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "./providers/QueryProvider";

// ScrollToTop component to ensure pages start at the top
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <QueryProvider>
      <Router>
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
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryProvider>
  );
}

export default App;
