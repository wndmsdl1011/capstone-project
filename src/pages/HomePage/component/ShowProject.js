import React from 'react'
import styled from "styled-components";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

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
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.9
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        >
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between",
                    alignItems: 'center',
                    width: '346.66px',
                    height: '28px'
                }}>
                    <ProjectIcon>
                        <ProjectIconText>
                            프로젝트
                        </ProjectIconText>
                    </ProjectIcon>
                    <div style={{ fontSize: '11.9px', color: '#9CA3AF', fontWeight: '700' }}>
                        {/* {project.date} */}
                        2023.05.24
                    </div>
                </div>
                <ProjectTitleContainer>
                    <ProjectTitleText>
                        {/* {project.title} */}
                        IT 직군 취업과 커리어 성장을 위한 사이드 프로젝트
                    </ProjectTitleText>
                </ProjectTitleContainer>
                <ProjectContentContainer>
                    <ProjectContentText>
                        {/* {project.content} */}
                        실무 경험을 쌓고 포트폴리오를 만들 수 있는 기회를 제공합니다.
                    </ProjectContentText>
                </ProjectContentContainer>
                <ProjectBottomContainer>
                    <div style={{
                        width: '52.34px',
                        height: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#4ade80' }} />
                        <div style={{ fontWeight: '700', fontSize: '11.9px', color: '#4b5563' }}>
                            모집중
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