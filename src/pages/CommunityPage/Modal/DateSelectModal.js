import React from 'react';
import { Dialog } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

const CenteredPanel = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalPanel = styled(Dialog.Panel)`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 300px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled(Dialog.Title)`
  font-size: 1.125rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  font-weight: bold;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 0.95rem;
`;

const ConfirmButton = styled.button`
  margin-top: 1rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const DateSelectModal = ({ isOpen, onClose, startDate, endDate, onChange }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Overlay aria-hidden="true" />
      <CenteredPanel>
        <ModalPanel>
          <Header>
            <Title>날짜 선택</Title>
            <CloseButton onClick={onClose}>X</CloseButton>
          </Header>

          <div>
            <Label>시작일</Label>
            <StyledDatePicker
              selected={startDate}
              onChange={(date) => onChange(date, 'start')}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Label>종료일</Label>
            <StyledDatePicker
              selected={endDate}
              onChange={(date) => onChange(date, 'end')}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ModalPanel>
      </CenteredPanel>
    </Dialog>
  );
};

export default DateSelectModal;
