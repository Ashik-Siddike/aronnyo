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
import StudentProfile from "./pages/StudentProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Certificate from "./pages/Certificate";
import Timetable from "./pages/Timetable";
import VideoLessons from "./pages/VideoLessons";
import Assignments from "./pages/Assignments";
import Messages from "./pages/Messages";
import StoryMode from "./pages/StoryMode";

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
                  <ScrollToTop />
                  <div className="min-h-screen pb-20 lg:pb-0">
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/class/:standard" element={<ClassSelection />} />
                        <Route path="/lessons/nursery-math" element={<MathLessons />} />
                        <Route path="/lessons/nursery-english" element={<EnglishLessons />} />
                        <Route path="/lessons/nursery-bangla" element={<BanglaLessons />} />
                        <Route path="/lessons/nursery-science" element={<ScienceLessons />} />
                        <Route path="/lessons/:subject" element={<DynamicLessons />} />
                        <Route path="/lesson/:subject/:id" element={<LessonDetail />} />
                        <Route path="/quiz/:subject/:id" element={<QuizPage />} />
                        <Route path="/counting-game" element={<CountingGame />} />
                        <Route path="/addition-game" element={<AdditionGame />} />
                        <Route path="/subtraction-game" element={<SubtractionGame />} />
                        <Route path="/multiplication-game" element={<MultiplicationGame />} />
                        <Route path="/spelling-wizard" element={<SpellingWizard />} />
                        <Route path="/animal-quiz" element={<AnimalQuiz />} />
                        <Route path="/plant-explorer" element={<PlantExplorer />} />
                        <Route path="/memory-match" element={<MemoryMatch />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/report-card" element={<ReportCard />} />
                        <Route path="/certificate" element={<Certificate />} />
                        <Route path="/timetable" element={<Timetable />} />
                        <Route path="/video-lessons" element={<VideoLessons />} />
                        <Route path="/assignments" element={<Assignments />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/story-mode" element={<StoryMode />} />
                        <Route path="/dashboard" element={
                          <DashboardErrorBoundary>
                            <StudentDashboard />
                          </DashboardErrorBoundary>
                        } />
                        <Route path="/parent" element={<ParentPanel />} />
                        <Route path="/profile" element={<StudentProfile />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/content" element={<NewContentManager />} />
                        <Route path="/admin/users" element={<NewUserManager />} />
                        <Route path="/admin/grades" element={<NewGradeSubjectManager />} />
                        <Route path="/admin/attendance" element={<AdminAttendance />} />
                        <Route path="/admin/report-cards" element={<AdminReportCard />} />
                        <Route path="/admin/analytics" element={<AdminAnalytics />} />
                        <Route path="/admin/import" element={<AdminBulkImport />} />
                        <Route path="/admin/approvals" element={<AdminContentApproval />} />
                        <Route path="/admin/backup" element={<AdminBackup />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                    <MobileDock />
                  </div>
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
