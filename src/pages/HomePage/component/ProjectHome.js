import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import ShowProject from './ShowProject';
import { getHomeProjectList } from '../../../features/home/homeSlice';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
  align-items: center;
  justify-content: center;
  padding: 64px 18px;
  background-color: aliceblue;
  height: 709px;
  display: flex;
  flex-direction: column;
  user-select: none; 
`;

const ProjectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1248px;
  height: 273px;
  gap: 32px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 210.91px;
  height: 60px;
  padding: 20px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.6s ease;
  background-color: ${(props) => (props.variant === 'student' ? '#5cebdf' : '#ffffff')};
  border: ${(props) => (props.variant === 'student' ? 'none' : '2px solid #5cebdf')};

  &:hover {
    background-color: ${(props) => (props.variant === 'student' ? '#ffffff' : '#5cebdf')};
    border: ${(props) => (props.variant === 'student' ? '2px solid #5cebdf' : 'none')}
  }
`;

const ButtonText = styled.div`
  font-weight: 700;
  font-size: 13.6px;
  transition: color 0.6s ease;
  color: ${(props) => (props.variant === 'student' ? '#ffffff' : '#5cebdf')};

  ${Button}:hover & {
    color: ${(props) => (props.variant === 'student' ? '#5cebdf' : '#ffffff')};
  }
`;

const ProjectHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector((state) => state.home);
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) setIsLoggedIn(true);
    else setIsLoggedIn(false);
    const fetchProjects = async () => {
      try {
        const response = await dispatch(getHomeProjectList());
        setProjects(response.payload.recentProjects);
      } catch (error) {
        console.error("프로젝트 불러오기 실패", error);
      }
    };

    fetchProjects();
  }, []);

  const MoveLogin = (userType) => {
    navigate("login", { state: { userType } });
  };

  const goToResume = () => {
    navigate("/resumelist", { state: { selectedMenu: "이력서 관리" } });
  };

  const goToProjects = () => {
    navigate("/projects");
  };

  return (
    <div>
      <Container>
        <div style={{ justifyItems: 'center', marginBottom: '48px' }}>
          <div style={{ fontWeight: '700', fontSize: '25.5px', color: '#1F2937', marginBottom: '12px' }}>진행중인 프로젝트</div>
          <div style={{ fontSize: '15.3px', color: '#4B5563', fontWeight: '700' }}>학생과 기업이 만나 새로운 가치를 만들어냅니다</div>
        </div>
        <ProjectContainer>
          {loading && (
            <LoadingSpinner />
          )}
          {error && (
            <div>{error}</div>
          )}
          {success && projects.map((proj, i) => (
            <ShowProject key={proj.id || i} delay={i * 0.8} project={proj} />
          ))}
        </ProjectContainer>
        {isLoggedIn && (
          <>
            <div style={{ fontWeight: '700', fontSize: '20.4px', color: '#1f2937', marginTop: '64px' }}>
              {profile?.name}님을 위한 추천!
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Button variant="company">
                <ButtonText variant="company" onClick={goToResume}>이력서 작성하러 가기</ButtonText>
              </Button>
              <Button variant="student">
                <ButtonText variant="student" onClick={goToProjects}>프로젝트 보러가기</ButtonText>
              </Button>
            </div>
          </>
        )}
        {!isLoggedIn && (
          <>
            <div style={{ fontWeight: '700', fontSize: '20.4px', color: '#1f2937', marginTop: '64px' }}>
              지금 바로 시작하세요
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Button variant="student">
                <ButtonText variant="student" onClick={() => MoveLogin("personal")}>학생으로 시작하기</ButtonText>
              </Button>
              <Button variant="company">
                <ButtonText variant="company" onClick={() => MoveLogin("business")}>기업으로 시작하기</ButtonText>
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  )
}

export default ProjectHome