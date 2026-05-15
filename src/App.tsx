import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StudentActivityProvider } from "./contexts/StudentActivityContext";
import Layout from "./components/Layout";
import DevelopmentOverlay from "./components/DevelopmentOverlay";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import MobileDock from "./components/MobileDock";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Teams from "./pages/Teams";
import ClassSelection from "./pages/ClassSelection";
import MathLessons from "./pages/MathLessons";
import EnglishLessons from "./pages/EnglishLessons";
import BanglaLessons from "./pages/BanglaLessons";
import ScienceLessons from "./pages/ScienceLessons";
import LessonDetail from "./pages/LessonDetail";
import QuizPage from "./pages/QuizPage";
import StudentDashboard from "./pages/StudentDashboard";
import DashboardErrorBoundary from "./components/DashboardErrorBoundary";
import ParentPanel from "./pages/ParentPanel";
import NewContentManager from "./components/admin/NewContentManager";
import NewUserManager from "./components/admin/NewUserManager";
import NewGradeSubjectManager from "./components/admin/NewGradeSubjectManager";
import DynamicLessons from "./pages/DynamicLessons";
import CountingGame from "./pages/CountingGame";
import AdditionGame from "./pages/AdditionGame";
import SubtractionGame from "./pages/SubtractionGame";
import MultiplicationGame from "./pages/MultiplicationGame";
import SpellingWizard from "./pages/SpellingWizard";
import AnimalQuiz from "./pages/AnimalQuiz";
import PlantExplorer from "./pages/PlantExplorer";
import MemoryMatch from "./pages/MemoryMatch";
import AIChatbot from "./components/AIChatbot";
import ScrollToTop from "./components/ScrollToTop";
import Leaderboard from "./pages/Leaderboard";
import Attendance from "./pages/Attendance";
import ReportCard from "./pages/ReportCard";
import AdminAttendance from "./components/admin/AdminAttendance";
import AdminReportCard from "./components/admin/AdminReportCard";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminBulkImport from "./components/admin/AdminBulkImport";
import AdminContentApproval from "./components/admin/AdminContentApproval";
import AdminBackup from "./components/admin/AdminBackup";
import AdminAssignments from "./components/admin/AdminAssignments";
import AdminTimetable from "./components/admin/AdminTimetable";
import AdminMessages from "./components/admin/AdminMessages";
import StudentProfile from "./pages/StudentProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Certificate from "./pages/Certificate";
import Timetable from "./pages/Timetable";
import VideoLessons from "./pages/VideoLessons";
import Assignments from "./pages/Assignments";
import Messages from "./pages/Messages";
import StoryMode from "./pages/StoryMode";
import GamesHub from "./pages/GamesHub";
import PageTransition from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { OfflineFallback } from "./components/OfflineFallback";
import OnboardingTour from "./components/OnboardingTour";
import PWAInstallBanner from "./components/PWAInstallBanner";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/teams" element={<PageTransition><Teams /></PageTransition>} />
        <Route path="/class/:standard" element={<PageTransition><ClassSelection /></PageTransition>} />
        <Route path="/lessons/nursery-math" element={<PageTransition><MathLessons /></PageTransition>} />
        <Route path="/lessons/nursery-english" element={<PageTransition><EnglishLessons /></PageTransition>} />
        <Route path="/lessons/nursery-bangla" element={<PageTransition><BanglaLessons /></PageTransition>} />
        <Route path="/lessons/nursery-science" element={<PageTransition><ScienceLessons /></PageTransition>} />
        <Route path="/lessons/:subject" element={<PageTransition><DynamicLessons /></PageTransition>} />
        <Route path="/lesson/:subject/:id" element={<PageTransition><LessonDetail /></PageTransition>} />
        <Route path="/quiz/:subject/:id" element={<PageTransition><QuizPage /></PageTransition>} />
        <Route path="/counting-game" element={<PageTransition><CountingGame /></PageTransition>} />
        <Route path="/addition-game" element={<PageTransition><AdditionGame /></PageTransition>} />
        <Route path="/subtraction-game" element={<PageTransition><SubtractionGame /></PageTransition>} />
        <Route path="/multiplication-game" element={<PageTransition><MultiplicationGame /></PageTransition>} />
        <Route path="/spelling-wizard" element={<PageTransition><SpellingWizard /></PageTransition>} />
        <Route path="/animal-quiz" element={<PageTransition><AnimalQuiz /></PageTransition>} />
        <Route path="/plant-explorer" element={<PageTransition><PlantExplorer /></PageTransition>} />
        <Route path="/memory-match" element={<PageTransition><MemoryMatch /></PageTransition>} />
        <Route path="/story-mode" element={<PageTransition><StoryMode /></PageTransition>} />
        <Route path="/games" element={<PageTransition><GamesHub /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><DashboardErrorBoundary><StudentDashboard /></DashboardErrorBoundary></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
        <Route path="/attendance" element={<PageTransition><Attendance /></PageTransition>} />
        <Route path="/report-card" element={<PageTransition><ReportCard /></PageTransition>} />
        <Route path="/parent-panel" element={<PageTransition><ParentPanel /></PageTransition>} />
        <Route path="/parent" element={<PageTransition><ParentPanel /></PageTransition>} />
        <Route path="/video-lessons" element={<PageTransition><VideoLessons /></PageTransition>} />
        <Route path="/assignments" element={<PageTransition><Assignments /></PageTransition>} />
        <Route path="/timetable" element={<PageTransition><Timetable /></PageTransition>} />
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><StudentProfile /></PageTransition>} />
        <Route path="/certificate" element={<PageTransition><Certificate /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />

        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/admin/users" element={<PageTransition><NewUserManager /></PageTransition>} />
        <Route path="/admin/content" element={<PageTransition><NewContentManager /></PageTransition>} />
        <Route path="/admin/subjects" element={<PageTransition><NewGradeSubjectManager /></PageTransition>} />
        <Route path="/admin/attendance" element={<PageTransition><AdminAttendance /></PageTransition>} />
        <Route path="/admin/report-cards" element={<PageTransition><AdminReportCard /></PageTransition>} />
        <Route path="/admin/analytics" element={<PageTransition><AdminAnalytics /></PageTransition>} />
        <Route path="/admin/import" element={<PageTransition><AdminBulkImport /></PageTransition>} />
        <Route path="/admin/approvals" element={<PageTransition><AdminContentApproval /></PageTransition>} />
        <Route path="/admin/backup" element={<PageTransition><AdminBackup /></PageTransition>} />
        <Route path="/admin/assignments" element={<PageTransition><AdminAssignments /></PageTransition>} />
        <Route path="/admin/timetable" element={<PageTransition><AdminTimetable /></PageTransition>} />
        <Route path="/admin/messages" element={<PageTransition><AdminMessages /></PageTransition>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LangProvider>
        <NotificationProvider>
          <AuthProvider>
            <StudentActivityProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <DevelopmentOverlay />
                <AIChatbot />
                <BrowserRouter>
                  <OnboardingTour />
                  <PWAInstallBanner />
                  <ScrollToTop />
                  <OfflineFallback>
                    <div className="min-h-screen pb-20 lg:pb-0">
                      <Layout>
                        <AnimatedRoutes />
                      </Layout>
                      <MobileDock />
                    </div>
                  </OfflineFallback>
                </BrowserRouter>
              </TooltipProvider>
            </StudentActivityProvider>
          </AuthProvider>
        </NotificationProvider>
      </LangProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
