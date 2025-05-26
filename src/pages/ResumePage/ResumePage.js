import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PlusIcon from "../../assets/images/Resume/+.png";
import ResumeImg from "../../assets/images/Resume/Resume.png";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import {
  resumeRegister,
  getResumeList,
  resumeDelete,
  resumeVisible,
  originResume,
  resumelistPage,
} from "../../features/resume/resumeSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 32px;
  background-color: #f7f7fa;
  min-height: 100vh;
`;

const Title = styled.div`
  width: 896px;
  font-size: 20.4px;
  font-weight: 700;
  margin-bottom: 32px;
`;

const ResumeContainer = styled.div`
  width: 896px;
  min-height: 482px;
  border-radius: 16px;
  background-color: #ffffff;
  padding: 32px;
`;

const Resume = styled.div`
  width: 832px;
  height: 98px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
  padding: 25px;
`;

const ResumeInContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const ResumeLeft = styled.div`
  display: flex;
  gap: 8px;
  flex-grow: 1;
  min-width: 0;
`;

const ResumeLeftAndRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const ResumeLeftAndLeft = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e6eeff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ResumeRight = styled.div`
  width: 150.23px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  gap: 4px;

  .form-check.form-switch {
    margin-bottom: 0;
    padding-top: 0;
    display: flex;
    align-items: center;

    .form-check-input {
      width: 40px;
      height: 24px;
      margin-top: 0;
      transform: scale(1);
    }
  }
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 24px;
  background-color: #f87171;
  color: white;
  font-size: 10px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ef4444;
  }
`;

const ResumeCreate = styled.div`
  width: 832px;
  height: 76px;
  border-radius: 12px;
  border: 2px dotted #e5e7eb;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const { resumeNumber } = useSelector((state) => state.resume);
  const today = new Date().toISOString().slice(2, 10).replace(/-/g, "");

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(resumelistPage());

    const fetchResumes = async () => {
      const result = await dispatch(getResumeList());
      setResumes(result.payload);
    };

    fetchResumes();
  }, [dispatch, navigate]);

  const handleResumeClick = (resumeId) => {
    dispatch(originResume());
    navigate(`/resume/${resumeId}`);
  };

  const handleSwitchChange = async (newVisible, resumeId) => {
    try {
      await dispatch(resumeVisible({ visible: newVisible, resumeId }));
      setResumes((prev) =>
        prev.map((resume) =>
          resume.resumeId === resumeId
            ? { ...resume, visible: newVisible }
            : resume
        )
      );
    } catch (error) {
      console.error("공개 범위 수정 중 오류:", error);
      alert("공개 범위 변경에 실패했습니다.");
    }
  };

  const handleResumeForm = async () => {
    if (resumeNumber >= 3) {
      alert("이력서는 최대 3개까지 보유하실 수 있습니다.");
      return;
    }
    const values = {
      title: `${profile.name}이력서_${today}`,
      intro: "",
      skills: [],
      githubUrl: "",
      visible: false,
      devposition: null,
      introduce: "",
      projects: [
        {
          name: "",
          description: "",
          techStack: [],
          githubLink: "",
          startDate: null,
          endDate: null,
        },
      ],
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
      setResumes((prev) =>
        prev.filter((resume) => resume.resumeId !== resumeId)
      );
    } catch (error) {
      console.error("이력서 삭제 중 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };
  return (
    <Container>
      <Title>이력서 관리</Title>
      <ResumeContainer>
        {resumes.map((resume) => (
          <Resume key={resume.resumeId}>
            <ResumeInContainer>
              <ResumeLeft>
                <ResumeLeftAndLeft
                  onClick={() => handleResumeClick(resume.resumeId)}
                >
                  <img src={ResumeImg} alt="Resume" />
                </ResumeLeftAndLeft>
                <ResumeLeftAndRight>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "13.6px",
                      color: "#1F2937",
                      cursor: "pointer",
                    }}
                    onClick={() => handleResumeClick(resume.resumeId)}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    {resume.title}
                  </div>
                  <div
                    onClick={() => handleResumeClick(resume.resumeId)}
                    style={{
                      fontWeight: 400,
                      fontSize: "11.9px",
                      color: "#6B7280",
                      cursor: "pointer",
                    }}
                  >
                    {resume.intro || "이력서 상세내용"}
                  </div>
                </ResumeLeftAndRight>
              </ResumeLeft>
              <ResumeRight>
                <div>{resume.visible ? "공개" : "비공개"}</div>
                <Form.Check
                  type="switch"
                  id={`switch-${resume.resumeId}`}
                  label=""
                  checked={resume.visible}
                  onChange={(e) =>
                    handleSwitchChange(e.target.checked, resume.resumeId)
                  }
                />
                <DeleteButton
                  onClick={() => handleDeleteResume(resume.resumeId)}
                >
                  삭제
                </DeleteButton>
              </ResumeRight>
            </ResumeInContainer>
          </Resume>
        ))}

        <ResumeCreate onClick={handleResumeForm}>
          <img src={PlusIcon} alt="+" />
          <div
            style={{ fontWeight: 400, fontSize: "13.6px", color: "#6B7280" }}
          >
            새 이력서 작성하기
          </div>
        </ResumeCreate>
      </ResumeContainer>
    </Container>
  );
};

export default ResumePage;
