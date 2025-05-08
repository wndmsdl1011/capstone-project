import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  width: 100%;
  position: relative;
  border: solid 1px #e5e7eb;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatusTag = styled.div`
  font-size: 12px;
  padding: 4px 10px;
  background-color: #e0f2fe;
  color: #0284c7;
  border-radius: 9999px;
  font-weight: 500;
`;

const ApplyDate = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const CardBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const Position = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const Skills = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top:7px;
`;

const SkillTag = styled.div`
  font-size: 12px;
  background-color: #f3f4f6;
  color: #374151;
  padding: 2px 8px;
  border-radius: 9999px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const ActionButton = styled.a`
  font-size: 13px;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #2563eb;
  }
`;

const ApplicantCard = ({
  name = '김지원',
  position = '프론트엔드 개발자',
  skills = ['React', 'TypeScript', 'Next.js'],
  status = '서류 검토 중',
  date = '2025.04.29',
  resumeLink = '#',
}) => {
  return (
    <Card>
      <CardTop>
        <StatusTag>{status}</StatusTag>
        <ApplyDate>신청일 : {date}</ApplyDate>
      </CardTop>
      <CardBody>
        <LeftSection>
          <ProfileImage>👩‍💻</ProfileImage>
          <Info>
            <Name>{name}</Name>
            <Position>{position}</Position>
            <Skills>
              {skills.map((skill, index) => (
                <SkillTag key={index}>{skill}</SkillTag>
              ))}
            </Skills>
          </Info>
        </LeftSection>
        
        
      </CardBody>
      <RightSection>
          <ActionButton href={resumeLink} target="_blank">
            이력서 보기
          </ActionButton>
        </RightSection>
    </Card>
  );
};

export default ApplicantCard;
