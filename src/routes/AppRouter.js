import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux"; // added
import AppLayOut from "../Layout/AppLayOut";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import PersonalRegisterPage from "../pages/RegisterPage/PersonalRegisterPage";
import CompanyRegisterPage from "../pages/RegisterPage/CompanyRegisterPage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import ProjectRegisterPage from "../pages/ProjectPage/ProjectRegisterPage";
import CommunityPage from "../pages/CommunityPage/CommunityPage";
import ResumeFormPage from "../pages/ResumePage/ResumeFormPage";
import ResumePage from "../pages/ResumePage/ResumePage";
import CompanyMyPage from "../pages/MyPage/companyMypage/CompanyMyPage";
import MyPage from "../pages/MyPage/personalMypage/MyPage";
import ProjectDetailPage from "../pages/ProjectPage/ProjectDetailPage";
import CompanyProjectDetailPage from "../pages/ProjectPage/CompanyProjectDetailPage.js"; // added
import ApplyFormPage from "../pages/ProjectPage/ApplyFormPage";
import ApplicantsManagePage from "../pages/ProjectPage/ApplicantsManagePage";
import AdminPage from '../pages/AdminPage/AdminPage';
import CommunityWrite from '../pages/CommunityPage/CommunityWrite.js';

const AppRouter = () => {
  const userRole = useSelector((state) => state.user.userRole); // added

  return (
    <Routes>
      {/* AppLayout을 기본 레이아웃으로 적용 */}
      <Route element={<AppLayOut />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage/user" element={<MyPage />} />
        <Route path="/mypage/company" element={<CompanyMyPage />} />
        <Route path="/register/personal" element={<PersonalRegisterPage />} />
        <Route path="/register/company" element={<CompanyRegisterPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route
          path="/projects/:id"
          element={
            userRole === "COMPANY" ? (
              <CompanyProjectDetailPage />
            ) : (
              <ProjectDetailPage />
            )
          }
        />{" "}
        {/* modified */}
        <Route path="/projects/register" element={<ProjectRegisterPage />} />
        <Route path="/projects/:id/apply" element={<ApplyFormPage />} />
        <Route path="/projects/:id/applicants" element={<ApplicantsManagePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/write" element={<CommunityWrite/>} />
        <Route path="/community/edit/:boardId" element={<CommunityWrite />} />
        <Route path="/resume/:resumeId" element={<ResumeFormPage />} />
        <Route path="/resumelist" element={<ResumePage />} />
        <Route path="/adminpage" element={<AdminPage />} />
      </Route>

      {/* NotFoundPage를 처리하는 라우트 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
