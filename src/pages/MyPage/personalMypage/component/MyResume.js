// MyResume.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ResumeCardItem from '../../../../common/component/ResumeCardItem';
import { useDispatch, useSelector } from 'react-redux';
import { resumeRegister } from '../../../../features/resume/resumeSlice';

const ResumeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const AddResumeButton = styled.button`
  width: 100%;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 20px;
  font-size: 15px;
  background: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const MyResume = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const [resumes, setResumes] = useState([
    { title: '이력서 제목 1', detail: '이력서 상세내용', isPublic: false },
    { title: '이력서 제목 2', detail: '이력서 상세내용', isPublic: false },
    { title: '이력서 제목 3', detail: '이력서 상세내용', isPublic: false },
  ]);

  const handleToggle = (index) => {
    const updated = [...resumes];
    updated[index].isPublic = !updated[index].isPublic;
    setResumes(updated);
  };

  const handleDelete = (index) => {
    const updated = resumes.filter((_, i) => i !== index);
    setResumes(updated);
  };
  const handleResumeForm = () => {
    const values = {
      title: `${profile.name}이력서_${today}`,
      intro: '',
      skills: [],
      githubUrl: '',
      visible: false,
      devposition: null,
    };

    dispatch(resumeRegister({ values, navigate }));
    navigate('/resume');
  };
  return (
    <ResumeContainer>
      {resumes.map((resume, idx) => (
        <ResumeCardItem
          key={idx}
          title={resume.title}
          detail={resume.detail}
          isPublic={resume.isPublic}
          onToggle={() => handleToggle(idx)}
          onDelete={() => handleDelete(idx)}
        />
      ))}
      <AddResumeButton onClick={handleResumeForm}>
        <FontAwesomeIcon icon={faPlus} /> 새 이력서 작성하기
      </AddResumeButton>
    </ResumeContainer>
  );
};

export default MyResume;
