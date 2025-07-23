import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { faCheck, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  getResumeList,
  resetResumeState,
} from '../../../../features/resume/resumeSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateRangeModal from './Modal/DateRangeModal';
import { faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { showToastMessage } from '../../../../features/common/uiSlice';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Warning = styled.p`
  font-size: 14px;
  color: #ef4444;
  margin-bottom: 16px;
`;

const ResumeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResumeCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background-color: #f9fafb;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    border-color: #34d399;
  }

  ${({ selected }) =>
    selected &&
    css`
      background-color: #ecfdf5;
      border-color: #34d399;
    `}
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  background-color: #e0e7ff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;

  svg {
    color: #2d3282;
    font-size: 20px;
  }
`;

const ResumeInfo = styled.div`
  flex: 1;
`;

const ResumeTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const ResumeDate = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: #10b981;
  font-size: 18px;
`;

const MatchButton = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 12px 0;
  background-color: #5eead4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #2dd4bf;
  }
`;
const StatusMessage = styled.p`
  color: #9ca3af;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 15px;
  text-align: center;
  margin-top: 20px;
`;

const LoadingMessage = styled.p`
  color: #6b7280;
  font-size: 15px;
  text-align: center;
  margin-top: 20px;
`;

const ResumeEmptyBox = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  margin-top: 16px;
`;

const ResumeWriteButton = styled.button`
  margin-top: 12px;
  background-color: #60a5fa;
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3b82f6;
  }
`;
const ResumeAiMatching = () => {
  const { resumeList, error, loading } = useSelector((state) => state.resume);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(resetResumeState());
    dispatch(getResumeList());
  }, [dispatch]);

  const openModal = () => {
    if (!selectedId) {
      dispatch(
        showToastMessage({
          message: '이력서를 선택해주세요.',
          status: 'error',
        })
      );
      return;
    }
    setIsModalOpen(true);
  };

  if (loading)
    return <LoadingMessage>이력서를 불러오는 중입니다...</LoadingMessage>;
  if (error)
    return (
      <ErrorMessage>
        이력서 목록을 불러오는 중 에러가 발생했습니다: {error}
      </ErrorMessage>
    );

  return (
    <>
      <Container>
        {resumeList && resumeList.length > 0 ? (
          <>
            <Title>이력서 선택</Title>
            <Warning>※ 이력서는 한 개만 선택 가능합니다.</Warning>
            <ResumeList>
              {resumeList.map((resume) => {
                const isSelected = selectedId === resume.resumeId;
                return (
                  <ResumeCard
                    key={resume.resumeId}
                    selected={isSelected}
                    onClick={() =>
                      setSelectedId(isSelected ? null : resume.resumeId)
                    }
                  >
                    <IconBox>
                      <FontAwesomeIcon icon={faFileAlt} />
                    </IconBox>
                    <ResumeInfo>
                      <ResumeTitle>{resume.title}</ResumeTitle>
                      <ResumeDate>최근 수정일: {resume.updatedAt}</ResumeDate>
                    </ResumeInfo>
                    {isSelected && <CheckIcon icon={faCheck} />}
                  </ResumeCard>
                );
              })}
            </ResumeList>
            <MatchButton onClick={openModal}>기업 AI 매칭하기</MatchButton>
          </>
        ) : (
          <ResumeEmptyBox>
            <FontAwesomeIcon
              icon={faFileCircleXmark}
              style={{
                fontSize: '32px',
                color: '#cbd5e1',
                marginBottom: '12px',
              }}
            />
            <div>
              등록된 이력서가 없습니다.
              <br />
              기업 AI 매칭을 위해 먼저 이력서를 작성해 주세요.
            </div>
            <ResumeWriteButton onClick={() => navigate('/resumelist')}>
              이력서 작성하러 가기
            </ResumeWriteButton>
          </ResumeEmptyBox>
        )}
      </Container>
      <DateRangeModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeId={selectedId}
      />
    </>
  );
};

export default ResumeAiMatching;
