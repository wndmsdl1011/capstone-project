// ResumeAiMatching.jsx
import React, { useEffect, useState } from 'react';
import styled, {createGlobalStyle, css } from 'styled-components';
import { faCheck, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  aiListClear,
  getResumeList,
  myPageResume,
  resumeAImatching,
} from '../../../../features/resume/resumeSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateRangeModal from './Modal/DateRangeModal';

const DatePickerStyles = createGlobalStyle`
  .react-datepicker {
    border: 1px solid #d0e2f2;
  }
  .react-datepicker__header {
    background-color: #e7f3ff;
    border-bottom: 1px solid #b3d4fc;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #b3d4fc;
    color: #004085;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #9ac8fa;
  }
`;

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

const ResumeAiMatching = () => {
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const [resumes, setResumes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  useEffect(() => {
    dispatch(myPageResume());
    dispatch(aiListClear());
    const fetchResumes = async () => {
      const result = await dispatch(getResumeList());
      const list = Array.isArray(result.payload) ? result.payload : [];
      setResumes(list);
    };

    fetchResumes();
  }, [dispatch]);

  const handleSelect = (id) => {
    setSelectedId(id); // 하나만 선택
  };
  const openModal = () => {
    if (!selectedId) {
      alert('이력서를 선택해주세요.');
      return;
    }
    setIsModalOpen(true);
  };

  return (
     <>
    <DatePickerStyles />
    <Container>
      <Title>이력서 선택</Title>
      <Warning>※ 이력서는 한 개만 선택 가능합니다.</Warning>
      {resumes && resumes.length > 0 ? (
      <ResumeList>
        {resumes?.map((resume) => (
          <ResumeCard
            key={resume?.resumeId}
            selected={resume?.resumeId === selectedId}
            onClick={() => handleSelect(resume?.resumeId)}
          >
            <IconBox>
              <FontAwesomeIcon icon={faFileAlt} />
            </IconBox>
            <ResumeInfo>
              <ResumeTitle>{resume?.title}</ResumeTitle>
              <ResumeDate>최근 수정일: {resume?.updatedAt}</ResumeDate>
            </ResumeInfo>
            {resume?.resumeId === selectedId && <CheckIcon icon={faCheck} />}
          </ResumeCard>
        ))}
      </ResumeList>
      ) : (
         <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
      로그인 후 이력서를 불러올 수 있습니다.
    </p>
      )}
      <MatchButton onClick={openModal}>기업 AI 매칭하기</MatchButton>
      </Container>
      <DateRangeModal
  show={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  resumeId={selectedId}
  startDate={startDate}
  endDate={endDate}
  setDateRange={setDateRange}
/>
      </>
    
  );
};

export default ResumeAiMatching;
