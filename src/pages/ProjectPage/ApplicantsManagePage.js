import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectDetail,
  fetchProjectApplicants,
} from "../../features/post/projectSlice";
import TechIcon from "../../components/TechIcon";
import { format, differenceInMonths } from "date-fns";

const ApplicantsManagePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { projectDetail, applicants } = useSelector((state) => state.project);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
      dispatch(fetchProjectApplicants(id));
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
          applicants.map((applicant, index) => (
            <ApplicantCard key={index}>
              <ApplicantHeader>
                <ApplicantInfo>
                  <ApplicantAvatar src={applicant.photo} alt={applicant.name} />
                  <div>
                    <ApplicantName>{applicant.name}</ApplicantName>
                    <ApplicantMeta>{applicant.devposition}</ApplicantMeta>
                  </div>
                </ApplicantInfo>
                <ApplicantStatus>{applicant.status}</ApplicantStatus>
              </ApplicantHeader>
              <AppliedAt>지원일: {applicant.appliedAt}</AppliedAt>
            </ApplicantCard>
          ))
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

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 24px;
  margin-bottom: 20px;
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
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ApplicantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ApplicantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ApplicantAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
`;

const ApplicantName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ApplicantMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const ApplicantStatus = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #2d3282;
`;

const AppliedAt = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
`;
