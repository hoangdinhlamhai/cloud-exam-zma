import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider as ZMPSnackbarProvider,
  ZMPRouter,
} from "zmp-ui";

const SnackbarProvider = ZMPSnackbarProvider as any;
import { AppProps } from "zmp-ui/app";

import LandingPage from "@/pages/index";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/home";
import CoursesPage from "@/pages/courses";
import ExamsPage from "@/pages/exams";
import ExamPage from "@/pages/exam";
import HistoryPage from "@/pages/history";
import HistoryDetailPage from "@/pages/history/detail";
import NotesPage from "@/pages/notes";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/home" element={<DashboardPage />}></Route>
            <Route path="/courses" element={<CoursesPage />}></Route>
            <Route path="/exams" element={<ExamsPage />}></Route>
            <Route path="/exam" element={<ExamPage />}></Route>
            <Route path="/history" element={<HistoryPage />}></Route>
            <Route path="/history/detail" element={<HistoryDetailPage />}></Route>
            <Route path="/notes" element={<NotesPage />}></Route>
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
