import React from 'react';
import styled from 'styled-components';

const PhoneFrame = styled.div`
  width: 320px;
  height: 600px;
  border: 16px solid black;
  border-radius: 36px;
  background: #f1f5f9;
  position: relative;
  overflow-y: auto;
  padding: 24px 12px;
`;

const NotificationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const NotificationContent = styled.div`
  font-size: 13px;
  color: #374151;
  margin-top: 6px;
`;

const NotificationList = () => {
  const notifications = [
    {
      type: '🧑‍💼 지원 알림',
      content: '김지원 님이 "AI 기반 채용 추천 시스템"에 지원했습니다.',
      time: '방금 전',
    },
    {
      type: '📩 문의 알림',
      content: '홍길동 님이 채용 문의를 남겼습니다.',
      time: '3시간 전',
    },
    {
      type: '🗂️ 시스템 알림',
      content: '새 프로젝트 공고가 등록되었습니다.',
      time: '어제',
    },
    {
      type: '🧑‍💼 지원 알림',
      content: '김지원 님이 "AI 기반 채용 추천 시스템"에 지원했습니다.',
      time: '방금 전',
    },
    {
      type: '📩 문의 알림',
      content: '홍길동 님이 채용 문의를 남겼습니다.',
      time: '3시간 전',
    },
    {
      type: '🗂️ 시스템 알림',
      content: '새 프로젝트 공고가 등록되었습니다.',
      time: '어제',
    },
    {
      type: '🧑‍💼 지원 알림',
      content: '김지원 님이 "AI 기반 채용 추천 시스템"에 지원했습니다.',
      time: '방금 전',
    },
    {
      type: '📩 문의 알림',
      content: '홍길동 님이 채용 문의를 남겼습니다.',
      time: '3시간 전',
    },
    {
      type: '🗂️ 시스템 알림',
      content: '새 프로젝트 공고가 등록되었습니다.',
      time: '어제',
    },
  ];

  return (
    <PhoneFrame>
      {notifications.map((n, i) => (
        <NotificationCard key={i}>
          <NotificationHeader>
            <NotificationTitle>{n.type}</NotificationTitle>
            <NotificationTime>{n.time}</NotificationTime>
          </NotificationHeader>
          <NotificationContent>{n.content}</NotificationContent>
        </NotificationCard>
      ))}
    </PhoneFrame>
  );
};

export default NotificationList;