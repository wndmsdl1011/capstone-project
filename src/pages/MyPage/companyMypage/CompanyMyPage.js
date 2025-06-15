import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faFileAlt,
  faUsers,
  faEnvelope,
  faFolderOpen,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MyProjects from './component/MyProjects';
import ApplicantList from './component/ApplicantList';
import InquiryList from './component/InquiryList';
import SavedResumes from './component/SavedResumes';
import NotificationBox from './component/NotificationBox';
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
  width: 100%;
  max-width: 1200px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 300px;
`;

const ProfileBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardWrapper = styled.div`
  width: 100%;
  perspective: 1000px;
  height: 270px; /* 원하는 고정 높이 */
  position: relative;
`;

const FlipCard = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  transform: ${({ flipped }) =>
    flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 110%;
  backface-visibility: hidden;
  border-radius: 12px;
  background-color: white;
  padding: 25px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Front = styled(CardFace)``;
const Back = styled(CardFace)`
  transform: rotateY(180deg);
`;

const ProfileIcon = styled.div`
  width: 84px;
  height: 84px;
  margin: 0 auto 10px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #3b82f6;
  margin-bottom: -20px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Label = styled.div`
  font-size: 16px;
  color: #374151;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;

  span {
    cursor: pointer;
    font-size: 18px;
    padding: 6px 10px;
    border-radius: 999px;
    transition: background-color 0.2s, color 0.2s;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }

    &.active {
      background-color: #dbeafe;
      color: white;
      opacity: 1;
    }
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 9999px;
`;

const CompanyLabel = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #111827;
`;

const CompanyText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
`;

const BizWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
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
  margin-top: 70px;
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

const CompanyMyPage = () => {
  const { profile } = useSelector((state) => state.user);
  const [selectedMenu, setSelectedMenu] = useState('내가 작성한 프로젝트 공고');
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("access_token");
  console.log('mypage', profile);
  const iconColor = '#2D3282';
  const menuItems = [
    {
      label: '내가 작성한 프로젝트 공고',
      icon: (
        <FontAwesomeIcon
          icon={faFileAlt}
          color={iconColor}
          style={{ marginRight: '7px', fontSize: '22px' }}
        />
      ),
    },
    {
      label: '지원자 목록 관리',
      icon: <FontAwesomeIcon icon={faUsers} color={iconColor} />,
    },
    {
      label: '받은 메시지/문의',
      icon: (
        <FontAwesomeIcon
          icon={faEnvelope}
          color={iconColor}
          style={{ marginRight: '5px' }}
        />
      ),
    },
    {
      label: '저장한 이력서',
      icon: (
        <FontAwesomeIcon
          icon={faFolderOpen}
          color={iconColor}
          style={{ marginRight: '3px' }}
        />
      ),
    },
    {
      label: '알림함',
      icon: (
        <FontAwesomeIcon
          icon={faBell}
          color={iconColor}
          style={{ marginRight: '7px' }}
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
          <CardWrapper>
            <IconRow>
              <span
                onClick={() => setFlipped(false)}
                className={!flipped ? 'active' : ''}
              >
                👤
              </span>
              <span
                onClick={() => setFlipped(true)}
                className={flipped ? 'active' : ''}
              >
                🏢
              </span>
            </IconRow>
            <FlipCard flipped={flipped}>
              {/* 앞면: 사용자 정보 */}
              <Front>
                <ProfileIcon>👤</ProfileIcon>
                <Info>
                  <Name>{profile?.name}</Name>
                  <Label>{profile?.position}</Label>
                </Info>
                <EditButton>프로필 수정</EditButton>
              </Front>

              {/* 뒷면: 회사 정보 */}
              <Back>
                <ProfileIcon>🏢</ProfileIcon>
                <TagRow>
                  <CompanyLabel>{profile?.companyName}</CompanyLabel>

                  <CompanyText>
                    🏠 <span>{profile?.companyLocation}</span>
                  </CompanyText>

                  <BizWrapper>
                    <Tag>사업자 번호</Tag>
                    <span>{profile?.businessNumber}</span>
                  </BizWrapper>
                </TagRow>
                <EditButton>프로필 수정</EditButton>
              </Back>
            </FlipCard>
          </CardWrapper>
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
                style={{ marginRight: '13px', fontSize: '22px' }}
              />
              로그아웃
            </LogoutButton>
          </SideMenuBox>
        </LeftColumn>

        <MainContent center={selectedMenu === '알림함'}>
          <ProjectGrid>
            
            {selectedMenu === '내가 작성한 프로젝트 공고' && <MyProjects />}
            {selectedMenu === '지원자 목록 관리' && <ApplicantList />}
            {selectedMenu === '받은 메시지/문의' && <InquiryList />}
            {selectedMenu === '저장한 이력서' && <SavedResumes />}
            {selectedMenu === '알림함' && <NotificationBox />}
            
          </ProjectGrid>
        </MainContent>
      </GridWrapper>
    </Container>
  );
};

export default CompanyMyPage;
