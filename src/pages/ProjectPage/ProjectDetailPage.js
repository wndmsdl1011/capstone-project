import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetail } from "../../features/post/projectSlice";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { projectDetail } = useSelector((state) => state.project);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
    }
  }, [id, dispatch]);

  if (!projectDetail) return <Container>불러오는 중...</Container>;

  return (
    <Container>
      <TopCard>
        <TagList>
          <Tag>프로젝트</Tag>
          {projectDetail.tags?.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </TagList>
        <Title>{projectDetail.title}</Title>
        <Meta>{projectDetail.managername}</Meta>
        <SectionTitle>기술 스택</SectionTitle>
        <TagList>
          {projectDetail.skills?.map((skill, i) => (
            <SkillTag key={i}>{skill}</SkillTag>
          ))}
        </TagList>
      </TopCard>

      <BottomCard>
        <SectionTitle>프로젝트 소개</SectionTitle>
        <Paragraph>{projectDetail.description}</Paragraph>

        <SectionTitle>주요 기능</SectionTitle>
        <UnorderedList>
          {projectDetail.features?.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </UnorderedList>

        <SectionTitle>필요 역량 - 프론트엔드</SectionTitle>
        <UnorderedList>
          {projectDetail.frontendRequirements?.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </UnorderedList>

        <SectionTitle>필요 역량 - 백엔드</SectionTitle>
        <UnorderedList>
          {projectDetail.backendRequirements?.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </UnorderedList>

        <SectionTitle>개발 환경</SectionTitle>
        <UnorderedList>
          {projectDetail.environment?.map((env, i) => (
            <li key={i}>{env}</li>
          ))}
        </UnorderedList>

        <Button>지원하기</Button>
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
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin: 16px 0;
`;

const Meta = styled.p`
  font-size: 14px;
  color: #6b7280;
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

const SkillTag = styled(Tag)`
  background: #e6eeff;
  color: #2d3282;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 24px;
`;

const Paragraph = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
`;

const UnorderedList = styled.ul`
  margin-top: 8px;
  padding-left: 24px;
  color: #4b5563;
  font-size: 14px;

  li {
    margin-bottom: 8px;
  }
`;

const Button = styled.button`
  background-color: #5cebdc;
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
