// components/DateRangeModal.jsx
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { MatchButton } from './YourStyledComponentsPath'; // MatchButton 스타일 컴포넌트 import 경로 수정 필요
import { useDispatch } from 'react-redux';
import { resumeAImatching } from '../../../../../features/resume/resumeSlice';
import styled, {createGlobalStyle, css } from 'styled-components';
import MatchingProgressModal from './MatchingProgressModal';

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

const DateRangeModal = ({ show, onClose, resumeId, startDate, endDate, setDateRange }) => {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const dispatch = useDispatch();
  const handleModalMatch = async () => {
    if (!startDate || !endDate) {
      alert('기간을 선택해주세요.');
      return;
    }
    try {
      dispatch(resumeAImatching({
      resumeId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }))
  // 순서를 바꾼다. 먼저 로딩모달 띄움
    setShowLoadingModal(true);

    // 모달을 닫는 동작을 약간 늦춤 (비동기 상태 업데이트 보장)
    setTimeout(() => {
      onClose();
    }, 100); // 100ms면 충분
  } catch (error) {
    console.error("매칭 중 오류 발생:", error);
  }
  };
  const handleMatchingComplete = () => {
  // setShowLoadingModal(false);
  // 여기에 결과 모달로 이동하거나 상태를 바꾸는 로직 추가 가능
};
  return (
    <>
    <DatePickerStyles />
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>매칭 기간 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginLeft: '10px' }}>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            inline
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <MatchButton onClick={handleModalMatch}>AI 매칭 시작하기</MatchButton>
      </Modal.Footer>
    </Modal>
    <MatchingProgressModal
  show={showLoadingModal}
  onClose={() => setShowLoadingModal(false)}
  onComplete={handleMatchingComplete}
/>
    </>
  );
};

export default DateRangeModal;
