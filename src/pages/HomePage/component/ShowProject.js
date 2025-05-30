import React from 'react'
import styled from "styled-components";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const ProjectIcon = styled.div`
  width: 72.45px;
  height: 28px;
  border-radius: 9999px;
  background-color: #E6EEFF;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectIconText = styled.div`
  font-weight: 700;
  font-size: 11.9px;
  color: #2D3282;
`;

const ProjectTitleContainer = styled.div`
  width: 346.66px;
  height: 56px;
`;

const ProjectTitleText = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #1F2937;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  transition: color 1.3s ease;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 24px;
  background-color: #ffffff;
  height: 273px;
  width: 394.66px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 1.3s ease;

  &:hover ${ProjectTitleText} {
    color: #3e31fa;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.03);
    }
  }
`;

const ProjectContentContainer = styled.div`
  width: 346.66px;
  height: 48px;
`;

const ProjectContentText = styled.div`
  font-size: 12px;
  color: #4b5563;
  font-weight: 700;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const ProjectBottomContainer = styled.div`
  margin-top: 16px;
  width: 346.66px;
  height: 36px;
  border-top: 1px solid #f3f4f6;
  justify-content: space-between;
  display: flex;
  align-items: flex-end;
`;

const ShowProject = ({ delay = 0, project }) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.9
  });

  const today = dayjs();
  const deadline = dayjs(project.recruitDeadline);
  const diffDays = deadline.diff(today, 'day');

  const statusText = diffDays < 0
    ? '모집마감'
    : diffDays <= 7
      ? '마감임박'
      : '모집중';
  const statusColor =
    statusText === '모집마감' ? '#9CA3AF' :
      statusText === '마감임박' ? '#facc15' :
        '#4ade80';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <Container onClick={() => navigate(`/projects/${project.projectId}`)}>
        <div style={{
          display: 'flex',
          justifyContent: "space-between",
          alignItems: 'center',
          width: '346.66px',
          height: '28px',
          opacity: statusText === '모집마감' ? 0.6 : 1
        }}>
          <ProjectIcon>
            <ProjectIconText>
              프로젝트
            </ProjectIconText>
          </ProjectIcon>
          <div style={{ fontSize: '11.9px', color: '#9CA3AF', fontWeight: '700' }}>
            {project.createdAt}
          </div>
        </div>
        <ProjectTitleContainer>
          <ProjectTitleText>
            {project.title}
          </ProjectTitleText>
        </ProjectTitleContainer>
        <ProjectContentContainer>
          <ProjectContentText>
            {project.description}
          </ProjectContentText>
        </ProjectContentContainer>
        <ProjectBottomContainer>
          <div style={{
            width: '62.34px',
            height: '20px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: statusColor }} />
            <div style={{ fontWeight: '700', fontSize: '11.9px', color: '#4b5563' }}>
              {statusText}
            </div>
          </div>
          <div style={{ fontWeight: '700', fontSize: '11.9px', color: '#9ca3af' }}>
            {/* 조회수 {project.views} */}
            조회수 1,234
          </div>
        </ProjectBottomContainer>
      </Container>
    </motion.div>
  )
}

export default ShowProject