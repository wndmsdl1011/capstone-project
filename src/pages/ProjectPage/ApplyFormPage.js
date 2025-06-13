import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  applyToProject,
  fetchProjectDetail,
  sendProjectApplyNotification,
} from "../../features/post/projectSlice";
import {
  getResumeList,
  getResumeDetail,
} from "../../features/resume/resumeSlice";
import TechIcon from "../../components/TechIcon";
import { showToastMessage } from "../../features/common/uiSlice";
const ApplyFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { projectDetail } = useSelector((state) => state.project);
  const { resumeNumber } = useSelector((state) => state.resume);
  const [selectedResume, setSelectedResume] = useState(null);
  const [introduction, setIntroduction] = useState("");
  const [resumes, setResumes] = useState([]);

  // Extract id from URL and fetch project details
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
    }
    
  }, [id, dispatch]);

  // Fetch resume list on mount
  useEffect(() => {
    dispatch(getResumeList()).then((res) => {
      if (Array.isArray(res.payload)) {
        setResumes(res.payload);
      } else {
        console.error("이력서 리스트 응답이 배열이 아님:", res.payload);
        setResumes([]);
      }
    });
  }, [dispatch]);

  return (
    <Container>
      <StepIndicator>
        <Step active>1 지원서 작성</Step>
        <StepDivider />
        <Step>2 지원 완료</Step>
      </StepIndicator>

      <Card>
        <Section>
          <TagRow>
            <Tag>프로젝트</Tag>
            {(() => {
              const getDeadlineStatus = (deadline) => {
                if (!deadline) return "모집중";
                const today = new Date();
                const deadlineDate = new Date(deadline);
                if (deadlineDate < today) return "마감";
                const diff = (deadlineDate - today) / (1000 * 60 * 60 * 24);
                if (diff <= 7) return "임박";
                return "모집중";
              };
              const status = getDeadlineStatus(projectDetail?.recruitDeadline);
              if (status === "임박") {
                return (
                  <Tag style={{ background: "#fff3cd", color: "#856404" }}>
                    마감임박
                  </Tag>
                );
              }
              if (status === "마감") {
                return (
                  <Tag style={{ background: "#f8d7da", color: "#721c24" }}>
                    모집 마감
                  </Tag>
                );
              }
              return (
                <Tag style={{ background: "#d1ecf1", color: "#0c5460" }}>
                  모집중
                </Tag>
              );
            })()}
          </TagRow>
          <DeadlineText>마감일: {projectDetail?.recruitDeadline}</DeadlineText>
          <ProjectTitle>{projectDetail?.title}</ProjectTitle>
          <ProfileRow>
            <Avatar>{projectDetail?.managername?.charAt(0) || "유"}</Avatar>
            <span>{projectDetail?.managername}</span>
          </ProfileRow>
          <Divider />
          <StackTitle>기술 스택</StackTitle>
          <TagWrapper>
            {projectDetail?.requiredSkill?.map((tech, index) => (
              <TechIcon key={index} tech={tech} size={28} />
            ))}
          </TagWrapper>
        </Section>

        <Section>
          <Label>개인 소개</Label>
          <TextArea
            placeholder="자기소개와 함께 프로젝트에 지원하게 된 동기를 작성해주세요"
            maxLength={1000}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
          <CharacterCount>{introduction.length}/1000</CharacterCount>
        </Section>

        <Section>
          <Label>지원 이력서</Label>
          {Array.isArray(resumes) &&
            resumes.map((resume) => (
              <ResumeBox
                key={resume.resumeId}
                selected={selectedResume === resume.resumeId}
                onClick={() => {
                  setSelectedResume(resume.resumeId);
                  dispatch(getResumeDetail(resume.resumeId));
                }}
              >
                <ResumeTitle>
                  <span role="img" aria-label="resume">
                    📄
                  </span>
                  {resume.title || "제목 없는 이력서"}
                </ResumeTitle>
                <ResumeMeta>
                  최근 수정일:{" "}
                  {resume.updatedAt
                    ? resume.updatedAt.slice(0, 10)
                    : "알 수 없음"}
                </ResumeMeta>
              </ResumeBox>
            ))}
          <NewResumeBox onClick={() => navigate("/resume")}>
            📄 새 이력서 작성하기
          </NewResumeBox>
        </Section>

        <SubmitButton
          onClick={async() => {
            if (!selectedResume) {
              dispatch(
                showToastMessage({
                  message: "이력서를 선택해주세요.",
                  status: "error",
                })
              );
              return;
            }

            dispatch(
              applyToProject({
                projectId: parseInt(id),
                resumeId: selectedResume,
              })
            )
              .unwrap()
              .then(() => {
                // toast.success("지원이 완료되었습니다!");
                dispatch(sendProjectApplyNotification({receiverId : id})).unwrap();
                navigate("/projects");
              })
              .catch((err) => {
                // toast.error(err || "지원에 실패했습니다.");
              });

          }}
        >
          지원하기
        </SubmitButton>
      </Card>
    </Container>
  );
};

export default ApplyFormPage;

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 0;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const Step = styled.div`
  font-weight: bold;
  color: ${(props) => (props.active ? "#10b981" : "#9ca3af")};
`;

const StepDivider = styled.div`
  width: 40px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 12px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const ProjectTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #1f2937;
  margin: 16px 0;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Tag = styled.span`
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  color: #374151;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
`;

const CharacterCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
`;

const ResumeBox = styled.div`
  border: 2px solid ${(props) => (props.selected ? "#10b981" : "#d1d5db")};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
  background: ${(props) => (props.selected ? "#ecfdf5" : "white")};
`;

const ResumeTitle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: bold;
`;

const ResumeMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const NewResumeBox = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const DeadlineText = styled.div`
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 4px;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  margin-top: 12px;
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  background-color: #cbd5e1;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
`;

const Divider = styled.div`
  border-top: 1px solid #e5e7eb;
  margin: 24px 0 16px;
`;

const StackTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;
