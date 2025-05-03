import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faArrowRightFromBracket,
  faClipboardCheck,
  faHistory,
  faIdBadge,
  faBookmark,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppliedProject from '../personalMypage/component/AppliedProjects';
import MyResume from '../personalMypage/component/MyResume';
import ScrappedProjects from '../personalMypage/component/ScrappedProjects';
import Notification from './component/Notification';
import { logout } from '../../../features/user/userSlice';
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f6f8fc;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  width: 90%;
  max-width: 1200px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const ProfileIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #3b82f6;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Role = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  background-color: white;
  color: #3b82f6;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #eff6ff;
  }
`;

const SideMenuBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
  font-size: 15px;
  background-color: ${({ selected }) => (selected ? '#e0edff' : 'white')};
  border: none;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }

  .icon {
    font-size: 18px;
  }

  .label {
    flex: 1;
    text-align: left;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  margin-left: 10px;
  margin-right: 20px;
  padding: 10px;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 15px;
  cursor: pointer;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 500px;
  ${({ center }) =>
    center &&
    `
    display: flex;
    justify-content: center;
    align-items: center;
  `}
`;
const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const MyPage = () => {
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const token = sessionStorage.getItem("access_token");
  const [selectedMenu, setSelectedMenu] = useState('지원한 프로젝트');
  const iconColor = '#2D3282';
  const menuItems = [
    {
      label: '지원한 프로젝트',
      icon: (
        <FontAwesomeIcon
          icon={faClipboardCheck}
          color={iconColor}
          style={{ marginRight: '3px', fontSize: '22px' }}
        />
      ),
    },
    {
      label: '이력서 관리',
      icon: (
        <FontAwesomeIcon
          icon={faIdBadge}
          color={iconColor}
          style={{ marginRight: '2px', fontSize: '21px' }}
        />
      ),
    },
    {
      label: '스크랩한 프로젝트',
      icon: (
        <FontAwesomeIcon
          icon={faBookmark}
          color={iconColor}
          style={{ marginRight: '5px' }}
        />
      ),
    },
    {
      label: '알림함',
      icon: (
        <FontAwesomeIcon
          icon={faBell}
          color={iconColor}
          style={{ marginRight: '2px' }}
        />
      ),
    },
  ];

  const handleLogout = () => {
        if (token) {
          dispatch(logout(token));
        } else {
          navigate("/login");
        }
      };
      
  return (
    <Container>
      <GridWrapper>
        <LeftColumn>
          <ProfileBox>
            <ProfileIcon>👤</ProfileIcon>
            <Name>{profile?.name}</Name>
            <Role>Frontend Developer</Role>
            <EditButton>프로필 수정</EditButton>
          </ProfileBox>

          <SideMenuBox>
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                selected={selectedMenu === item.label}
                onClick={() => setSelectedMenu(item.label)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </MenuItem>
            ))}

            <LogoutButton onClick={handleLogout}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                style={{ marginRight: '10px', fontSize: '20px' }}
              />
              로그아웃
            </LogoutButton>
          </SideMenuBox>
        </LeftColumn>

        <MainContent center={selectedMenu === '알림함'}>
          <ProjectGrid>
            
            {selectedMenu === '지원한 프로젝트' && <AppliedProject />}
            {selectedMenu === '이력서 관리' && <MyResume />}
            {selectedMenu === '스크랩한 프로젝트' && <ScrappedProjects />}
            {selectedMenu === '알림함' && <Notification />}
            
          </ProjectGrid>
        </MainContent>
      </GridWrapper>
    </Container>
  );
};

export default MyPage;
