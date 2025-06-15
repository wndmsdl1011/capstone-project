import React from 'react';
import styled from 'styled-components';

const InquiryCard = styled.div`
 position: relative; /* 추가 */
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  border: solid 1px #e5e7eb;
`;

const StatusTag = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 9999px;
  background-color: ${props =>
    props.status === '답변 완료' ? '#DBEAFE' : '#F3F4F6'};
  color: ${props =>
    props.status === '답변 완료' ? '#2563EB' : '#6B7280'};
`;

const Date = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  color: #9CA3AF;
`;

const SenderInfo = styled.div`
  display: inline-block;
  width: fit-content;
  margin-top:36px;
  font-size: 13px;
  font-weight: 500;
  background-color: #e0edff;
  padding: 4px 10px;
  border-radius: 9999px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #1F2937;
`;

const ContentPreview = styled.div`
  font-size: 14px;
  color: #4B5563;
  line-height: 1.4;
`;

const ViewButton = styled.button`
  align-self: flex-end;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background-color: #2563EB;
  }
`;

const InquiryItemCard = ({
  name = '홍길동',
  email = 'user@example.com',
  title = '채용 절차에 대해 문의드립니다.',
  content = '귀사의 채용 과정이 궁금합니다. 이력서 제출 후 일정이나 준비해야 할 사항이 있을까요?',
  date = '2025.04.29',
  status = '미확인',
}) => {
  return (
    <InquiryCard>
      <StatusTag status={status}>{status}</StatusTag>
      <Date>{date}</Date>
      
      <SenderInfo>{name} ({email})</SenderInfo>
      
      <Title>{title}</Title>
      <ContentPreview>{content}</ContentPreview>
      
      <ViewButton>자세히 보기</ViewButton>
      
    </InquiryCard>
  );
};

export default InquiryItemCard;
