import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import ShowProject from './ShowProject';
import { getHomeProjectList } from '../../../features/home/homeSlice';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  // const { error, project } = useSelector((state) => state.home);

  // useEffect(() => {
  //   dispatch(getHomeProjectList());
  // }, [dispatch, project, error])

  const MoveLogin = (userType) => {
    navigate("login", { state: { userType } });
  };
  
  return (
    <div>
      <Container>
        <div style={{ justifyItems: 'center', marginBottom: '48px' }}>
          <div style={{ fontWeight: '700', fontSize: '25.5px', color: '#1F2937', marginBottom: '12px' }}>진행중인 프로젝트</div>
          <div style={{ fontSize: '15.3px', color: '#4B5563', fontWeight: '700' }}>학생과 기업이 만나 새로운 가치를 만들어냅니다</div>
        </div>
        <ProjectContainer>
          {/* {error ? (
            <div style={{ width: '100%', textAlign: 'center', color: '#ef4444', fontWeight: '700' }}>
              프로젝트 데이터를 불러오는 데 실패했습니다.
            </div>
          ) : (
            project.slice(0, 3).map((proj, i) => (
              <ShowProject key={proj.id || i} delay={i * 0.8} project={proj} />
            ))
          )} */}
          {[0, 1, 2].map((i) => (
            <ShowProject key={i} delay={i * 0.8} />
          ))}
        </ProjectContainer>
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
      </Container>
    </div>
  )
}

export default ProjectHome