import React from 'react'
import styled from "styled-components";
import BannerImage from '../../../assets/images/Home/Notice.png'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  background-color: #e6eeff;
  height: 352px;
  user-select: none;  
`;

const NoticeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 24px;
  background-color: #ffffff;
  width: 1248px;
  height: 288px;
  padding: 0 32px;
`;

const NoticeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; 
  padding: 24px 0;
  font-family: 'Pretendard', sans-serif;
`;

const NoticeImage = styled.div`
  margin-top: 20px;
`;

const Image = styled.img`
  
`;

const NoticeIcon = styled.div`
  width: 76.48px;
  height: 28px;
  border-radius: 9999px;
  background-color: ghostwhite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoticeIconText = styled.div`
  font-weight: 700;
  font-size: 11.9px;
  color: #5cebdf;
`;

const Button = styled.button`
  border: none;
  background-color: #ffffff;
  font-weight: 700;
  font-size: 13.6px;
  color: #2d3282;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start; 
`;

const Notice = () => {
  return (
    <Container>
      <NoticeContainer>
        <NoticeContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NoticeIcon>
              <NoticeIconText>
                NOTICE
              </NoticeIconText>
            </NoticeIcon>
            <div style={{ fontSize: '11.9px', color: '#9ca3af', fontWeight: '700' }}>
              2023.05.31
            </div>
          </div>
          <div style={{ fontWeight: '700', fontSize: '25.5px', color: '#1f2937' }}>직무별 인터뷰 체크 리스트 무료 배포 중</div>
          <div style={{ fontSize: '15.3px', color: '#4b5563', fontWeight: '700' }}>지금 JMP 인스타그램 이벤트에 참여해보세요🎯</div>
          <Button>
            자세히 보기 ➔
          </Button>
        </NoticeContent>
        <NoticeImage>
          <Image src={BannerImage} alt='광고' />
        </NoticeImage>
      </NoticeContainer>
    </Container>
  )
}

export default Notice