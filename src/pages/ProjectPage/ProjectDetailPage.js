import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetail } from "../../features/post/projectSlice";
import TechIcon from "../../components/TechIcon";
import { format, differenceInMonths } from "date-fns";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { projectDetail } = useSelector((state) => state.project);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
    }
  }, [id, dispatch]);

  if (!projectDetail) return <Container>불러오는 중...</Container>;

  // 모집 상태 유틸 함수
  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "마감";
    if (diffDays <= 7) return "임박";
    return "진행중";
  };

  return (
    <Container>
      <TopCard>
        <TagRow>
          <Tag>프로젝트</Tag>
          {(() => {
            const status = getDeadlineStatus(projectDetail.recruitDeadline);
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
        <SectionTitle style={{ marginTop: 0 }}>프로젝트 정보</SectionTitle>
        <InfoRow>
          <InfoItem>
            <InfoLabel>📅 프로젝트 기간</InfoLabel>
            <InfoText>
              {format(new Date(projectDetail.startDate), "yyyy.MM.dd")} ~{" "}
              {format(new Date(projectDetail.endDate), "yyyy.MM.dd")} (
              {differenceInMonths(
                new Date(projectDetail.endDate),
                new Date(projectDetail.startDate)
              ) + 1}
              개월)
            </InfoText>
          </InfoItem>
          <InfoItem>
            <InfoLabel>👥 모집 인원</InfoLabel>
            <InfoText>{projectDetail.recruitCount}명</InfoText>
          </InfoItem>
        </InfoRow>
        <SectionTitle>프로젝트 소개</SectionTitle>
        <Paragraph>{projectDetail.description}</Paragraph>

        <Button
          onClick={() => {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
              navigate("/login");
            } else {
              navigate(`/projects/${id}/apply`);
            }
          }}
        >
          지원하기
        </Button>
      </BottomCard>
    </Container>
  );
};

export default ProjectDetailPage;

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 32px;
`;

const TopCard = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const BottomCard = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

// const SkillTag = styled(Tag)`
//   background: #e6eeff;
//   color: #2d3282;
// `;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 24px;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
`;

const Button = styled.button`
  background-color: #2d3282;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 32px;
  display: block;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 12px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 6px;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: #4b5563;
`;
