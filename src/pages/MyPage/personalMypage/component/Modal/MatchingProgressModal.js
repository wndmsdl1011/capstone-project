// components/MatchingProgressModal.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import MatchingResultModal from './MatchingResultModal';
const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 20px;
    padding: 32px;
    text-align: center;
    min-width: 480px;
  }
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

const MainText = styled.p`
  color: #475569;
  margin-top: 16px;
  margin-bottom: 32px;
  font-size: 15px;
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;

  border: 4px solid #e0edff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerCircle = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto;
  border: 6px solid #e0f2f1;
  border-top: 6px solid #14b8a6;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const StepList = styled.div`
  text-align: left;
  margin: 32px 0 24px 0;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StepDot = styled.div`
  width: 12px;
  height: 12px;
  margin-top: 5px;
  margin-right: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#14b8a6' : '#cbd5e1')};
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div`
  font-weight: 600;
  color: ${(props) => (props.active ? '#14b8a6' : '#94a3b8')};
`;

const StepDesc = styled.div`
  color: #94a3b8;
  font-size: 13px;
`;

const SkeletonContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 24px;
`;
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBar = styled.div`
  height: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  width: ${(props) => (props.short ? '50%' : '100%')};
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const CancelButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #334155;
  }
`;

//  ai매칭 오류시 창을 걍 닫음음?
// 모달창 나갔다 올시 aiMatchingTop3초기화?
// 그리고 결과값이 있으면 다음 모달창 넘어가게게
const steps = [
  {
    label: '이력서 분석 중',
    description: '사용자의 기술 스택과 경력을 분석하고 있습니다',
  },
  {
    label: '프로젝트 검색 중',
    description: '적합한 프로젝트를 검색하고 있습니다',
  },
  {
    label: '매칭도 계산 중',
    description: '프로젝트의 매칭도를 계산하고 있습니다',
  },
  { label: '결과 정리 중', description: '최적의 프로젝트를 선별하고 있습니다' },
];

const MatchingProgressModal = ({ show, onClose, onComplete }) => {
  const { aiMatchingTop3 } = useSelector((state) => state.resume);
  const [stepIndex, setStepIndex] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (show) {
      setStepIndex(0); // 모달 열릴 때 stepIndex 초기화
    }
  }, [show]);

  useEffect(() => {
    if (!show) return; // 모달이 열릴 때만 interval 작동

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 10000); // 1분 간격

    return () => clearInterval(interval);
  }, [show]);

  useEffect(() => {
    if (aiMatchingTop3) {
      onComplete();
    }
  }, [aiMatchingTop3, onComplete]);

  useEffect(() => {
    if (aiMatchingTop3 && aiMatchingTop3?.recommendations?.length > 0) {
      setTimeout(() => {
        setShowResultModal(true);
      }, 1000); // 부드럽게 전환되도록 약간 delay
    }
  }, [aiMatchingTop3]);

  if (showResultModal) {
    if (show) onClose();
    return (
      <MatchingResultModal
        show={true}
        onHide={() => setShowResultModal(false)}
      />
    );
  }

  return (
    <StyledModal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <Title>
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          AI 프로젝트 추천
        </Title>
        <SpinnerWrapper>
          <SpinnerCircle />
        </SpinnerWrapper>
        <MainText>이력서에 맞는 프로젝트를 찾고 있습니다...</MainText>

        <StepList>
          {steps.map((step, idx) => (
            <StepItem key={idx} active={idx <= stepIndex}>
              <StepDot active={idx <= stepIndex} />
              <StepContent>
                <StepTitle active={idx <= stepIndex}>{step.label}</StepTitle>
                <StepDesc>{step.description}</StepDesc>
              </StepContent>
            </StepItem>
          ))}
        </StepList>

        <SkeletonContainer>
          <SkeletonBar />
          <SkeletonBar short />
          <SkeletonBar />
        </SkeletonContainer>

        <CancelButton onClick={onClose}>취소하기</CancelButton>
      </Modal.Body>
    </StyledModal>
  );
};

export default MatchingProgressModal;
