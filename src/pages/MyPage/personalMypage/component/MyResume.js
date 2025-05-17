// MyResume.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ResumeCardItem from '../../../../common/component/ResumeCardItem';
import { useDispatch, useSelector } from 'react-redux';
import { resumeRegister, getResumeList, resumeDelete, resumeVisible, originResume } from '../../../../features/resume/resumeSlice';

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
  const { resumeNumber } = useSelector((state) => state.resume);
  const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      const result = await dispatch(getResumeList());
      setResumes(result.payload);
    };

    fetchResumes();
  }, []);

  const handleResumeClick = (resumeId) => {
    originResume();
    navigate(`/resume/${resumeId}`);
  };

  // const handleToggle = (index) => {
  //   const updated = [...resumes];
  //   updated[index].isPublic = !updated[index].isPublic;
  //   setResumes(updated);
  // };

  const handleSwitchChange = async (newVisible, resumeId) => {
    try {
      await dispatch(resumeVisible({ visible: newVisible, resumeId }));
      setResumes(prev =>
        prev.map(resume =>
          resume.resumeId === resumeId ? { ...resume, visible: newVisible } : resume
        )
      );
    } catch (error) {
      console.error("공개 범위 수정 중 오류:", error);
      alert("공개 범위 변경에 실패했습니다.");
    }
  };

  // const handleDelete = (index) => {
  //   const updated = resumes.filter((_, i) => i !== index);
  //   setResumes(updated);
  // };

  const handleResumeForm = async () => {
    if (resumeNumber >= 3) {
      alert("이력서는 최대 3개까지 보유하실 수 있습니다.");
      return;
    }
    const values = {
      title: `${profile.name}이력서_${today}`,
      intro: '',
      skills: [],
      githubUrl: '',
      visible: false,
      devposition: null,
      introduce: '',
      projects: [],
    };

    const res = await dispatch(resumeRegister({ values, navigate }));

    const resumeId = res?.payload?.resumeId || res?.resumeId;

    if (resumeId) {
      navigate(`/resume/${resumeId}`);
    } else {
      console.error("이력서 ID 없음. 응답 확인 필요:", res);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    const confirmDelete = window.confirm("정말 이력서를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await dispatch(resumeDelete(resumeId));
      setResumes(prev => prev.filter(resume => resume.resumeId !== resumeId));
    } catch (error) {
      console.error("이력서 삭제 중 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <ResumeContainer>
      {resumes.map((resume) => (
        <ResumeCardItem
          onClick={() => handleResumeClick(resume.resumeId)}
          key={resume.resumeId}
          title={resume.title}
          detail={resume.intro}
          isPublic={resume.visible}
          onToggle={(checked) => handleSwitchChange(checked, resume.resumeId)}
          onDelete={() => handleDeleteResume(resume.resumeId)}
        />
      ))}
      <AddResumeButton onClick={handleResumeForm}>
        <FontAwesomeIcon icon={faPlus} /> 새 이력서 작성하기
      </AddResumeButton>
    </ResumeContainer>
  );
};

export default MyResume;
