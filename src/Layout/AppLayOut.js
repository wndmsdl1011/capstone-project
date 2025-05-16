import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBriefcase,
  faUserCircle,
  faFileAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import ToastMessage from '../common/component/ToastMessage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, logout } from '../features/user/userSlice';
import UserProfileBox from '../common/component/UserProfileBox'
import { useCookies } from 'react-cookie';

const Container = styled.div`
  margin: 0 auto;
  position: relative;
  background-color: #f9fafb;
  width: 100%;
  
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  background-color: #ffffff;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const Logo = styled(Link)`
  font-family: "Inter";
  font-size: 30px;
  font-weight: 700;
  color: #2d3282;
  text-decoration: none;

  span {
    font-weight: 400;
    font-size: 12px;
    vertical-align: middle;
    margin-left: 2px;
  }
`;

const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  font-size: 15px;
  font-family: "Inter";

  a {
    color: #000;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      font-size: 16px;
    }

    &:hover {
      opacity: 0.7;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const NavButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "primary",
})`
  background-color: ${(props) => (props.primary ? "#2D3282" : "transparent")};
  color: ${(props) => (props.primary ? "#ffffff" : "#2D3282")};
  border: ${(props) => (props.primary ? "none" : "1px solid #2D3282")};
  border-radius: 9999px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
`;
const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationButton = styled.button`
  background: transparent;
  border: none;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  color: #2d3282;

  &:hover {
    opacity: 0.7;
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 240px;
  padding: 12px;
  z-index: 1000;
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Inter";
  font-size: 14px;
`;
const Footer = styled.footer`
  background-color: #2d3282;
  color: #d1d5db;
  padding: 48px 16px;
  margin-top: 80px;
  font-family: "Inter";
  font-size: 13px;
`;

const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FooterColumn = styled.div`
  min-width: 180px;
  margin-bottom: 24px;
`;

const AppLayout = ({ authenticate, setAuthenticate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.user);
  const [cookies] = useCookies(["refresh"]);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  const [showNotifications, setShowNotifications] = useState(false);
  console.log("profile", profile);

  return (
    <Container>
      <ToastMessage />
      <Navbar>
        <Logo to="/">
          J<span>ob</span> M<span>iddleware</span> P<span>latform</span>
        </Logo>
        <NavCenter>
          <Link to="/projects">
            <FontAwesomeIcon icon={faBriefcase} /> 프로젝트
          </Link>
          <Link to="/community">
            <FontAwesomeIcon icon={faUserCircle} /> 커뮤니티
          </Link>
          <Link to="/resumelist">
            <FontAwesomeIcon icon={faFileAlt} /> 이력서 관리
          </Link>
        </NavCenter>
        <ButtonGroup>
          <NavButton onClick={() => alert("비즈니스 문의")}>
            비즈니스 문의
          </NavButton>
          {profile ? (
            <NavRight>
              <div style={{ position: "relative" }}>
                <NotificationButton
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FontAwesomeIcon icon={faBell} />
                </NotificationButton>
                {showNotifications && (
                  <NotificationDropdown>
                    <div>🔔 새로운 알림이 없습니다.</div>
                    {/* 여기에 알림 리스트를 map으로 출력 가능 */}
                  </NotificationDropdown>
                )}
              </div>

              <UserBox>
                <UserProfileBox />
              </UserBox>

              {/* <NavButton primary onClick={handleLogout}>로그아웃</NavButton> */}
            </NavRight>
          ) : (
            <NavButton primary onClick={() => navigate("/login")}>
              로그인
            </NavButton>
          )}
        </ButtonGroup>
      </Navbar>

      <main>
        <Outlet />
      </main>

      <Footer>
        <FooterInner>
          <FooterColumn>
            <div style={{ fontWeight: 700, fontSize: "20px", color: "#fff" }}>
              Job Middleware Platform
            </div>
            <div style={{ marginTop: "10px" }}>
              청년-기업 실무 교류를 위한 단기 프로젝트 매칭 플랫폼으로,
              학생들에게는 실무 경험을<br></br>
              기업에게는 인재 발굴의 기회를 제공합니다.
            </div>
          </FooterColumn>
          <FooterColumn>
            <div style={{ fontWeight: 600, color: "#fff" }}>서비스</div>
            <div>프로젝트 찾기</div>
            <div>프로젝트 등록</div>
            <div>이용 가이드</div>
          </FooterColumn>
          <FooterColumn>
            <div style={{ fontWeight: 600, color: "#fff" }}>회사 소개</div>
            <div>소개</div>
            <div>공지사항</div>
            <div>연락처</div>
          </FooterColumn>
          <FooterColumn>
            <div style={{ fontWeight: 600, color: "#fff" }}>고객센터</div>
            <div>이용약관</div>
            <div>개인정보처리방침</div>
            <div>FAQ</div>
          </FooterColumn>
        </FooterInner>
        <div
          style={{ textAlign: "center", marginTop: "24px", color: "#9CA3AF" }}
        >
          © 2025 Job Middleware Platform. All rights reserved.
        </div>
      </Footer>
    </Container>
  );
};

export default AppLayout;
