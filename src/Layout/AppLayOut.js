import React, { useEffect, useState, useRef } from "react"; // useRef 추가
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faUserCircle,
  faFileAlt,
  faBell,
  faUserTie, // 지원 알림 아이콘
  faCheckCircle, // 합격 알림 아이콘
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import ToastMessage from "../common/component/ToastMessage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../features/user/userSlice";
import UserProfileBox from "../common/component/UserProfileBox";
import { useCookies } from "react-cookie";
import NewNotice from '../common/NewNotice.js';
import { fetchNotifications } from '../features/notification/notificationSlice.js';
import RefreshTokenTimer from '../common/RefreshTokenTimer.js';

const Container = styled.div`
  margin: 0 auto;
  position: relative;
  background-color: #f9fafb;
  width: 100%;
`;

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

// 빨간색 알림 동그라미를 위한 styled component
const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444; /* Tailwind red-500 */
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #ffffff;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 320px; /* 드롭다운 너비 증가 */
  max-height: 400px; /* 최대 높이 설정 */
  overflow-y: auto; /* 스크롤 가능하게 */
  padding: 12px;
  z-index: 1000;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6; /* 회색 경계선 */
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const NotificationIcon = styled.div`
  font-size: 20px;
  color: #2d3282;
`;

const NotificationContent = styled.div`
  flex: 1;
  font-family: "Inter";
  font-size: 14px;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const NotificationType = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const NotificationMessage = styled.div`
  color: #374151;
  line-height: 1.4;
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

// 시간 형식 변환 유틸리티 함수
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  const years = Math.floor(days / 365);
  return `${years}년 전`;
};

const AppLayout = ({ authenticate, setAuthenticate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.user);
  const { notifications, loading } = useSelector((state) => state.notification); // 알림 상태 가져오기
  const [cookies] = useCookies(["refresh"]);
  const token = sessionStorage.getItem("access_token");
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null); // 드롭다운 외부 클릭 감지를 위한 ref
  const userRole = sessionStorage.getItem("userRole");
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    // 사용자 프로필과 알림을 동시에 가져옵니다.
    console.log("userRole in effect:", userRole); // 👈 얘가 null이면 100% 이게 원인
    if (token){
      dispatch(fetchUserProfile());
      dispatch(fetchNotifications());
    } 
    console.log("loading",loading);
  }, [dispatch, token]);


  
  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // 알림 클릭 핸들러 (예시: 프로젝트 상세 페이지로 이동)
  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    setShowNotifications(false); // 드롭다운 닫기
    // 여기에 알림 유형에 따라 다른 페이지로 이동하는 로직을 추가할 수 있습니다.
    // 예: if (notification.eventType === 'apply') navigate(`/projects/${notification.projectId}`);
  };

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
  <NavButton onClick={() => alert("비즈니스 문의")}>비즈니스 문의</NavButton>

  {token ? (
  <>
  
    <NewNotice />
    <NavRight>
      <div style={{ position: "relative" }} ref={notificationRef}>
        <NotificationButton onClick={() => setShowNotifications(!showNotifications)}>
          <FontAwesomeIcon icon={faBell} />
          {notifications.length > 0 && (
            <NotificationBadge>{notifications.length}</NotificationBadge>
          )}
        </NotificationButton>

        {showNotifications && (
          <NotificationDropdown>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.eventId}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationIcon>
                    {notification.eventType === "apply" ? (
                      <FontAwesomeIcon icon={faUserTie} />
                    ) : notification.eventType === "accept" ? (
                      <FontAwesomeIcon icon={faCheckCircle} />
                    ) : (
                      "🔔"
                    )}
                  </NotificationIcon>
                  <NotificationContent>
                    <NotificationHeader>
                      <NotificationType>
                        {notification.eventType === "apply"
                          ? "지원 알림"
                          : notification.eventType === "accept"
                          ? "📩 합격 알림"
                          : "알림"}
                      </NotificationType>
                      <NotificationTime>
                        {formatTimeAgo(notification.createdAt)}
                      </NotificationTime>
                    </NotificationHeader>
                    <NotificationMessage>{notification.message}</NotificationMessage>
                  </NotificationContent>
                </NotificationItem>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6b7280",
                }}
              >
                🔔 새로운 알림이 없습니다.
              </div>
            )}
          </NotificationDropdown>
        )}
      </div>
        
      <UserBox>
        <RefreshTokenTimer/>
        <UserProfileBox />
      </UserBox>
    </NavRight>
  </>
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
              학생들에게는 실무 경험을
              <br></br>
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