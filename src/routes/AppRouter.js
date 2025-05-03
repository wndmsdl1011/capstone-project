import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayOut from "../Layout/AppLayOut";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import PersonalRegisterPage from "../pages/RegisterPage/PersonalRegisterPage";
import CompanyRegisterPage from "../pages/RegisterPage/CompanyRegisterPage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import ProjectRegisterPage from "../pages/ProjectPage/ProjectRegisterPage"
import CommunityPage from "../pages/CommunityPage/CommunityPage";
import ResumePage from "../pages/ResumePage/ResumeFormPage";
import CompanyMyPage from '../pages/MyPage/companyMypage/CompanyMyPage';
import MyPage from '../pages/MyPage/personalMypage/MyPage';

const AppRouter = () => {
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
        <Route path="/projects/register" element={<ProjectRegisterPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Route>

      {/* NotFoundPage를 처리하는 라우트 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;