import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Badge } from 'react-bootstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faArrowRight,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { aiListClear } from '../../../../../features/resume/resumeSlice';
import { motion } from 'framer-motion';
const ResultModalWrapper = styled.div`
  padding: 40px;
  background-color: #f9fbfd;
  border-radius: 16px;
  text-align: center;
`;

const Title = styled.h5`
  font-weight: bold;
  color: #202775;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 26px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const ProjectCard = styled.div`
  position: relative;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
`;

const RecommendationBox = styled.div`
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #4b5563;
  margin: 12px 0;
`;

const Highlight = styled.span`
  color: #2563eb;
  font-weight: 500;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const MetaInfo = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ProjectTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 2px;
  color: #1f2937;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const IconBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #e0f2fe;
  color: #0284c7;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 26px;
  font-weight: 600;
  margin-right: 12px;
`;

const TitleAndSkills = styled.div`
  display: flex;
  flex-direction: column;
`;
const SkillWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

const SkillBadge = styled(Badge)`
  background-color: #e0f2fe !important;
  color: #0284c7;
  margin-right: 6px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 20px;
`;

const MySkillTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280; 
  margin: 8px 0 6px;
`;

const MySkillBadgeWrapper = styled.div`
  margin-bottom: 16px;
`;

const MySkillBadge = styled(Badge)`
  background-color: #f3f4f6 !important;
  color: #374151;
  margin-right: 6px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 20px;
`;

const Percentage = styled.div`
  font-weight: bold;
  color: #10b981;
  font-size: 18px;
  position: absolute;
  top: 24px;
  right: 24px;
`;

const ApplyButton = styled.button`
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;
  height: 40px;
  &:hover {
    background-color: #16a34a;
  }
`;

const MoreButton = styled.button`
  background-color: transparent;
  color: #5eead4;
  border: 1px solid #5eead4;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.2s ease;
  &:hover {
    background-color: #ccfbf1;
  }
`;

const MatchingResultModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const aiMatchingTop3 = useSelector((state) => state.resume.aiMatchingTop3);
  const medals = ['🥇', '🥈', '🥉'];
  const handleNavigate = () => {
    onHide(); // 모달 닫기
    navigate('/projects'); // 프로젝트 페이지로 이동
    // dispatch(aiListClear());
  };
  const handleApply = (id) => {
    navigate(`/projects/${id}`);
    // dispatch(aiListClear());
  };
  const handleClose = () => {
    // dispatch(aiListClear());
    if (onHide) onHide(); // 외부에도 닫기 알림
  }; //테스트 해봐야할듯.

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="fade-modal"
    >
      <Modal.Header closeButton />
      <Modal.Body>
        <ResultModalWrapper>
          <Title>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            AI 프로젝트 추천
          </Title>
          <Subtitle>
            회원님의 이력서를를 분석하여 가장 적합한 프로젝트를 추천해드립니다.
          </Subtitle>

          {aiMatchingTop3.recommendations
            ?.slice() // 원본 배열을 복사
            .sort((a, b) => b.score - a.score)
            .map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.5 }} // 순차적으로 등장
              >
                <ProjectCard key={project.id}>
                  <HeaderRow>
                    <IconBox>{medals[index]}</IconBox>

                    <TitleAndSkills>
                      <ProjectTitle>{project.title}</ProjectTitle>

                      <SkillWrapper>
                        {project.requiredSkill?.map((skill) => (
                          <SkillBadge key={skill}>{skill}</SkillBadge>
                        ))}
                      </SkillWrapper>
                    </TitleAndSkills>
                  </HeaderRow>
                  <MySkillTitle>나의 기술스택</MySkillTitle>
                  <MySkillBadgeWrapper>
                    {aiMatchingTop3.userSkills?.map((skill) => (
                      <MySkillBadge key={skill}>{skill}</MySkillBadge>
                    ))}
                  </MySkillBadgeWrapper>
                  <RecommendationBox>
                    <Highlight>추천 이유:</Highlight>{' '}
                    {project.details ||
                      'React와 TypeScript 기술 스택에 일치하며, 프론트엔드 개발 경험이 요구되는 프로젝트입니다.'}
                  </RecommendationBox>

                  <BottomRow>
                    <MetaInfo>
                      마감일: {project.deadline || '2025.05.25'} &nbsp;&nbsp;
                      조회수: {project.views || '128'}
                    </MetaInfo>
                    <div>
                      <Percentage>{project.score}% 매칭</Percentage>
                      <ApplyButton onClick={() => handleApply(project.id)}>
                        지원하기 <FontAwesomeIcon icon={faArrowRight} />
                      </ApplyButton>
                    </div>
                  </BottomRow>
                </ProjectCard>
              </motion.div>
            ))}
          <MoreButton onClick={handleNavigate}>
            더 많은 프로젝트 보기
          </MoreButton>
        </ResultModalWrapper>
      </Modal.Body>
    </Modal>
  );
};

export default MatchingResultModal;
