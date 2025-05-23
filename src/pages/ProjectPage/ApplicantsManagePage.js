import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectDetail,
  fetchProjectApplicants,
} from "../../features/post/projectSlice";
import TechIcon from "../../components/TechIcon";
import { FaGithub } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns";

const ApplicantsManagePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { projectDetail, applicants } = useSelector((state) => state.project);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
      dispatch(fetchProjectApplicants(id)).then((res) => {
        console.log("지원자 목록 응답 데이터:", res.payload);
      });
    }
  }, [id, dispatch]);

  if (!projectDetail) return <Container>불러오는 중...</Container>;

  // 모집 상태 계산 함수
  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "마감";
    if (diffDays <= 7) return "임박";
    return "진행중";
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    try {
      return format(new Date(dateString), "yyyy.MM.dd");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Container>
      <TopCard>
        <TagRow>
          <Tag>프로젝트</Tag>
          {/* 모집 상태 태그 */}
          {(() => {
            const status = getDeadlineStatus(projectDetail.recruitDeadline);
            return (
              <>
                {status === "임박" && (
                  <Tag style={{ background: "#fff3cd", color: "#856404" }}>
                    마감임박
                  </Tag>
                )}
                {status === "마감" && (
                  <Tag style={{ background: "#f8d7da", color: "#721c24" }}>
                    모집 마감
                  </Tag>
                )}
                {status === "진행중" && (
                  <Tag style={{ background: "#d1ecf1", color: "#0c5460" }}>
                    모집중
                  </Tag>
                )}
              </>
            );
          })()}
        </TagRow>
        <MetaRow style={{ marginTop: "8px" }}>
          <DeadlineSection>
            마감일: {projectDetail.recruitDeadline}
          </DeadlineSection>
        </MetaRow>
        <Title>{projectDetail.title}</Title>
        <MetaRow style={{ marginTop: "16px", marginBottom: "0" }}>
          <ProfileSection>
            <Avatar>{projectDetail.managername?.charAt(0) || "유"}</Avatar>
            <span>{projectDetail.managername}</span>
          </ProfileSection>
        </MetaRow>
        <SectionTitle
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
            marginTop: "24px",
          }}
        >
          기술 스택
        </SectionTitle>
        <TagList>
          {projectDetail.requiredSkill?.map((skill, i) => (
            <TechIcon key={i} tech={skill} size={28} />
          ))}
        </TagList>
      </TopCard>

      <BottomCard>
        <SectionTitle style={{ marginTop: 0 }}>지원자 목록</SectionTitle>
        {applicants && applicants.length > 0 ? (
          applicants.map((applicant, index) => {
            const resume = applicant.resume || {};
            return (
              <ApplicantCard key={index}>
                <ApplicantProfileCardHeader>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <ApplicantAvatarLarge
                      src={
                        resume.photo
                          ? `http://localhost:8080/uploads/${resume.photo}`
                          : applicant.photo
                          ? `http://localhost:8080/uploads/${applicant.photo}`
                          : "/default-profile.png"
                      }
                      alt={applicant.name || "지원자"}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <ApplicantName>
                        {applicant.name || "이름 없음"}
                      </ApplicantName>
                      <DevPositionText>
                        {applicant.devposition || "포지션 정보 없음"}
                      </DevPositionText>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <div>
                      {resume.githubUrl && (
                        <>
                          <GitHubIconButton
                            href={resume.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tooltip-id={`gh-tooltip-${index}`}
                            aria-label="GitHub 프로필 링크"
                          >
                            <FaGithub size={22} />
                          </GitHubIconButton>
                          <Tooltip
                            id={`gh-tooltip-${index}`}
                            place="bottom"
                            content="GitHub 프로필 링크"
                          />
                        </>
                      )}
                    </div>
                    <DateText>{formatDate(applicant.appliedAt)}</DateText>
                  </div>
                </ApplicantProfileCardHeader>

                <ApplicantInfoSection>
                  <InfoCard style={{ marginBottom: "16px" }}>
                    <ResumeTitleText>
                      {resume.title || "제목 없음"}
                    </ResumeTitleText>
                    <ResumeIntroText>
                      {resume.intro || "소개 없음"}
                    </ResumeIntroText>
                  </InfoCard>
                  <InfoCard style={{ marginBottom: "16px" }}>
                    <SectionTitleSmall>기술 스택</SectionTitleSmall>
                    <TagList>
                      {resume.skills?.length ? (
                        resume.skills.map((skill, i) => (
                          <TechIcon key={i} tech={skill} size={28} />
                        ))
                      ) : (
                        <PlaceholderText>
                          기술 스택 정보가 없습니다.
                        </PlaceholderText>
                      )}
                    </TagList>
                  </InfoCard>
                  <InfoCard style={{ marginBottom: "16px" }}>
                    <SectionTitleSmall>프로젝트</SectionTitleSmall>
                    {resume.projects?.length ? (
                      resume.projects.map((project, i) => (
                        <ProjectSummary key={i}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "15px",
                                color: "#1f2937",
                              }}
                            >
                              {project.name || "프로젝트명 없음"}
                            </div>
                            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                              {project.startDate
                                ? format(new Date(project.startDate), "yyyy.MM")
                                : "시작일 없음"}{" "}
                              ~{" "}
                              {project.endDate
                                ? format(new Date(project.endDate), "yyyy.MM")
                                : "종료일 없음"}
                            </div>
                          </div>

                          <ProjectDescription>
                            {project.description || "설명 없음"}
                          </ProjectDescription>

                          <ProjectTech>
                            사용 기술:
                            {project.techStack?.length ? (
                              project.techStack.map((tech, idx) => (
                                <TechIcon key={idx} tech={tech} size={24} />
                              ))
                            ) : (
                              <span
                                style={{ color: "#9ca3af", marginLeft: "4px" }}
                              >
                                정보 없음
                              </span>
                            )}
                          </ProjectTech>

                          {project.githubLink && (
                            <ProjectGitHubLink
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="프로젝트 GitHub"
                            >
                              <FaGithub size={18} style={{ marginRight: 6 }} />
                              프로젝트 보기
                            </ProjectGitHubLink>
                          )}
                        </ProjectSummary>
                      ))
                    ) : (
                      <PlaceholderText>
                        프로젝트 요약 정보가 없습니다.
                      </PlaceholderText>
                    )}
                  </InfoCard>
                  <InfoCard>
                    <SectionTitleSmall>자기소개</SectionTitleSmall>
                    <SelfIntroduction>
                      {resume.introduce || "자기소개가 없습니다."}
                    </SelfIntroduction>
                  </InfoCard>
                </ApplicantInfoSection>

                <ApplicantStatusSection>
                  <StatusButtons>
                    <StatusButton $status="합격">합격</StatusButton>
                    <StatusButton $status="불합격">불합격</StatusButton>
                  </StatusButtons>
                </ApplicantStatusSection>
              </ApplicantCard>
            );
          })
        ) : (
          <PlaceholderText>아직 지원자가 없습니다.</PlaceholderText>
        )}
      </BottomCard>
    </Container>
  );
};

export default ApplicantsManagePage;

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 32px 0 48px 0;
`;

const TopCard = styled.div`
  background: #ffffff;
  padding: 24px 24px 28px 24px;
  border-radius: 16px;
  margin-bottom: 28px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f6;
`;

const BottomCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f6;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #1f2937;
  margin: 16px 0;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
`;

const DeadlineSection = styled.div`
  font-size: 13px;
  color: #9ca3af;
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

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  color: #4b5563;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 24px;
  margin-bottom: 20px;
`;

const SectionTitleSmall = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 6px;
  margin-bottom: 12px;
`;

const PlaceholderText = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
`;

const ApplicantCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 28px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ApplicantProfileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  padding-bottom: 0;
`;

const ApplicantInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ApplicantAvatarLarge = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  object-fit: cover;
  background-color: #f3f4f6;
  border: 2px solid #f1f3f6;
`;

const ApplicantName = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const GitHubIconButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e0ecff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: #2563eb;
  border: none;
  outline: none;
  transition: background 0.15s;
  margin-left: 2px;
  &:hover {
    background: #c9dbfc;
    color: #1d4ed8;
    text-decoration: none;
  }
  font-size: 22px;
  cursor: pointer;
`;

const ProjectSummary = styled.div`
  margin-bottom: 16px;
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 14px 16px 14px 16px;
  border: 1px solid #f3f4f6;
  box-shadow: none;
`;

const ProjectTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ProjectDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;

  ul {
    margin-top: 4px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 4px;
  }
`;

const ProjectTech = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  align-items: center;
`;

const ProjectGitHubLink = styled.a`
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: #1d4ed8;
  }
`;

const SelfIntroduction = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
  white-space: pre-wrap;
  line-height: 1.5;
  margin-bottom: 0;
  border: 1px solid #f3f4f6;
`;

const ApplicantStatusSection = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const StatusButton = styled.button.attrs({ type: "button" })`
  font-size: 14px;
  font-weight: 500;
  padding: 6px 20px;
  border-radius: 9999px;
  border: 1px solid
    ${({ $status }) =>
      $status === "합격"
        ? "#22c55e"
        : $status === "불합격"
        ? "#ef4444"
        : "#3b82f6"};
  color: ${({ $status }) =>
    $status === "합격"
      ? "#22c55e"
      : $status === "불합격"
      ? "#ef4444"
      : "#3b82f6"};
  background-color: ${({ $status }) =>
    $status === "합격"
      ? "#ecfdf5"
      : $status === "불합격"
      ? "#fef2f2"
      : "#eff6ff"};
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: none;
  &:hover {
    background-color: ${({ $status }) =>
      $status === "합격"
        ? "#d1fae5"
        : $status === "불합격"
        ? "#fee2e2"
        : "#dbeafe"};
  }
`;

const StatusButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const DateText = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 6px;
`;

const DevPositionText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const InfoCard = styled.div`
  background: rgb(249, 250, 251);
  border-radius: 10px;
  padding: 16px 18px 14px 18px;
  margin-bottom: 14px;
  border: 1px solid #f3f4f6;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ResumeTitleText = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
`;

const ResumeIntroText = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const ProjectDates = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
`;
