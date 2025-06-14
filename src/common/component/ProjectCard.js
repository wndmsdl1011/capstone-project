import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import TechIcon from "../../components/TechIcon";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb; // 💡 연한 회색 테두리 추가

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  width: 400px;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.div`
  background-color: #e0edff;
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
`;

const ViewCount = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const Title = styled.div`
  font-size: 15px;
  margin: 12px 0;
  line-height: 1.4;
  strong {
    font-weight: bold;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: -6px;
`;

const Tag = styled.div`
  background-color: #f3f4f6;
  color: #374151;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 9999px;
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const DetailButton = styled.button`
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  border-radius: 9999px;
  background: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #eff6ff;
  }
`;
const ProjectCard = ({
  project,
  dateLabel = "지원일",
  dateValue = project?.appliedAt,
}) => {
  const navigate = useNavigate();

  const subtitle = "사이드 프로젝트";
  const tags = project?.requiredSkills ?? project?.skills ?? [];

  const today = dayjs();
  const deadline = dayjs(project?.recruitDeadline);
  const diffDays = deadline.diff(today, "day");

  const statusText =
    diffDays < 0 ? "모집마감" : diffDays <= 7 ? "마감임박" : "모집중";
  const statusColor =
    statusText === "모집마감"
      ? "#f8d7da"
      : statusText === "마감임박"
      ? "#fff3cd"
      : "#d1ecf1";
  const statusTextColor =
    statusText === "모집마감"
      ? "#721c24"
      : statusText === "마감임박"
      ? "#856404"
      : "#0c5460";

  return (
    <Card>
      <CardTop>
        <StatusBadge
          style={{ backgroundColor: statusColor, color: statusTextColor }}
        >
          {statusText}
        </StatusBadge>
        <ViewCount>👁 {project?.viewCount}</ViewCount>
      </CardTop>

      <Title>
        [{subtitle}] <strong>{project?.title}</strong>
      </Title>

      <Tags>
        {tags?.map((tag) => (
          <TechIcon key={tag} tech={tag} size={24} />
        ))}
      </Tags>
      <hr />
      <CardBottom>
        <DateText>지원일 : {project?.appliedAt}</DateText>
        <DetailButton
          onClick={() => navigate(`/projects/${project?.projectId}`)}
        >
          상세보기
        </DetailButton>
      </CardBottom>
    </Card>
  );
};

export default ProjectCard;
