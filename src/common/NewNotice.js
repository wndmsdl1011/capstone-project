import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { setLatestNotification, clearLatestNotification } from '../features/notification/notificationSlice';

// Styled Components 임포트
import styled, { keyframes, css } from 'styled-components';


// 애니메이션 Keyframes
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// 애니메이션 적용을 위한 헬퍼 CSS
const slideInAnimation = css`
  animation: ${slideInRight} 0.5s ease forwards;
`;

const slideOutAnimation = css`
  animation: ${slideOutRight} 0.5s ease forwards;
`;

// 메인 백그라운드 컨테이너
const Background = styled.div`
  position: fixed;
  bottom: 5px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  width: 400px;

  // props에 따라 애니메이션 적용
  ${props => props.$animationType === 'slide-in' && slideInAnimation}
  ${props => props.$animationType === 'slide-out' && slideOutAnimation}
`;

// 알림 카드 스타일
const NotificationCard = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
`;

// 각 요소 스타일
const Title = styled.h3`
  margin-top: 0;
  color: #333;
`;

const Message = styled.p`
  margin-bottom: 10px;
  color: #555;
`;

const Timestamp = styled.small`
  color: #888;
  font-size: 0.8em;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #333;
  }
`;

// --- NewNotice 컴포넌트 ---
function NewNotice() {
  const dispatch = useDispatch();
  const latestNotification = useSelector((state) => state.notification.latestNotification);

  // 애니메이션 타입을 직접 상태로 관리
  const [animationType, setAnimationType] = useState(''); // 'slide-in', 'slide-out'
  const slideOutTimerRef = useRef(null);
  const clearNotificationTimerRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      console.warn('Access token not found in session storage. SSE connection not established.');
      return;
    }

    const EventSource = EventSourcePolyfill || NativeEventSource;
    const SSE_API_URL = 'http://localhost:8080/api/sse/subscribe';

    const eventSource = new EventSource(SSE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        Accept: 'text/event-stream',
      },
      heartbeatTimeout: 86400000,
    });

    eventSource.onopen = () => {
      console.log('SSE CONNECTED');
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    eventSource.addEventListener('apply', (event) => {
      try {
        const notificationData = JSON.parse(event.data);
        console.log('Received new application notification:', notificationData);
        dispatch(setLatestNotification(notificationData));

        // 기존 타이머 클리어
        if (slideOutTimerRef.current) clearTimeout(slideOutTimerRef.current);
        if (clearNotificationTimerRef.current) clearTimeout(clearNotificationTimerRef.current);

        setAnimationType('slide-in'); // 슬라이드 인 애니메이션 시작

        slideOutTimerRef.current = setTimeout(() => {
          setAnimationType('slide-out'); // 5초 후 슬라이드 아웃 시작

          clearNotificationTimerRef.current = setTimeout(() => {
            dispatch(clearLatestNotification()); // 알림 상태 비우기 (UI에서 사라짐)
            setAnimationType(''); // 애니메이션 타입 초기화
          }, 500); // 슬라이드 아웃 애니메이션 시간 (0.5s)
        }, 5000); // 5초 동안 알림 표시
      } catch (e) {
        console.error('Failed to parse SSE event data:', e);
      }
    });

    return () => {
      if (slideOutTimerRef.current) clearTimeout(slideOutTimerRef.current);
      if (clearNotificationTimerRef.current) clearTimeout(clearNotificationTimerRef.current);
      eventSource.close();
      console.log('SSE CLOSED');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!latestNotification) {
    return null;
  }

  return (
    // Background 컴포넌트에 $animationType prop을 전달하여 애니메이션 제어
    <Background $animationType={animationType}>
      <NotificationCard>
        <Title>새 프로젝트 지원 알림!</Title>
        <Message>
          <strong>{latestNotification.senderName}</strong> 님이 '
          <strong>
            {latestNotification.message
              .replace(`${latestNotification.senderName} 님이 '`, '')
              .replace(`' 프로젝트에 지원하셨습니다.`, '')}
          </strong>
          ' 프로젝트에 지원했습니다.
        </Message>
        <Timestamp>
          {new Date(latestNotification.date).toLocaleDateString()}{' '}
          {new Date(latestNotification.date).toLocaleTimeString()}
        </Timestamp>
        <CloseButton
          onClick={() => {
            setAnimationType('slide-out');
            if (slideOutTimerRef.current) clearTimeout(slideOutTimerRef.current);
            if (clearNotificationTimerRef.current) clearTimeout(clearNotificationTimerRef.current);
            clearNotificationTimerRef.current = setTimeout(() => {
              dispatch(clearLatestNotification());
              setAnimationType('');
            }, 500);
          }}
        >
          &times;
        </CloseButton>
      </NotificationCard>
    </Background>
  );
}

export default NewNotice;