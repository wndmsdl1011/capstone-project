// components/ResumeCardItem.jsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const ResumeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

const ResumeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ResumeIcon = styled.div`
  background-color: #e0edff;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d3282;
`;

const ResumeText = styled.div`
  display: flex;
  flex-direction: column;

  & > h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }

  & > span {
    font-size: 13px;
    color: #6b7280;
  }
`;

const ToggleLabel = styled.label`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleSwitch = styled.div`
  width: 50px;
  height: 26px;
  border-radius: 50px;
  background-color: ${({ isPublic }) => (isPublic ? '#A7F3D0' : '#F87171')};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const ToggleHandle = styled.div`
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ isPublic }) => (isPublic ? '26px' : '2px')};
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: #ef4444;
  }
`;

const ResumeCardItem = ({ title, detail, isPublic, onToggle, onDelete, onClick }) => (
  <ResumeCard onClick={onClick}>
    <ResumeInfo>
      <ResumeIcon>
        <FontAwesomeIcon icon={faFileAlt} />
      </ResumeIcon>
      <ResumeText>
        <h4>{title}</h4>
        <span>{detail}</span>
      </ResumeText>
    </ResumeInfo>
    <RightControls>
      <ToggleLabel>공개 범위</ToggleLabel>
      
      <ToggleSwitch isPublic={isPublic} onClick={(e) => {
        e.stopPropagation();
        onToggle(!isPublic);
      }}>
        <ToggleHandle isPublic={isPublic} />
      </ToggleSwitch>


      <DeleteButton onClick={(e) => {
        e.stopPropagation(); 
        onDelete();
      }}>
        <FontAwesomeIcon icon={faTrash} />
      </DeleteButton>
    </RightControls>
  </ResumeCard>
);

export default ResumeCardItem;
