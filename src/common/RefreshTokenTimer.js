import styled, {css} from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, decrementRemaining, logout, reissueToken } from "../features/user/userSlice";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function RefreshTokenTimer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expiresIn, expiresAt } = useSelector((state) => state.user || {});

  const hasShownFiveMinAlert = useRef(false);
  const [showModal, setShowModal] = useState(false);
  // 1. 타이머 카운트다운
  useEffect(() => {
    if (expiresIn === null || expiresIn === undefined) return;

    const interval = setInterval(() => {
      dispatch(decrementRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresIn, dispatch]);

  // 2. 5분 알림
  useEffect(() => {
    if (expiresIn === 1780 && !hasShownFiveMinAlert.current) {
      // alert("세션이 5분 후 만료됩니다. 연장해주세요.");
      setShowModal(true);
      hasShownFiveMinAlert.current = true;
    }
  }, [expiresIn]);

  // 3. 만료 시간 체크
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => { // 살짝 중복 수정 필요
      const now = new Date();
      const expireTime = new Date(expiresAt);
      if (now >= expireTime) {
        dispatch(clearAuth());
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        const token = sessionStorage.getItem("access_token");
        dispatch(logout({ token, navigate }));  
        window.location.href = "/login";
      }
    }, 5000); // 5초마다 검사

    return () => clearInterval(interval);
  }, [expiresAt, dispatch]);

 /* ---------- 버튼 핸들러 ---------- */
  const handleLogout = useCallback(() => {
    const token = sessionStorage.getItem("access_token");
    dispatch(logout({ token, navigate }));
  }, [dispatch, navigate]);

  const handleExtend = useCallback(() => {
    dispatch(reissueToken());
    setShowModal(false);
    hasShownFiveMinAlert.current = false; // 연장 후 다시 5분 알림을 받을 수 있게
  }, [dispatch]);
  

  if (expiresIn === null || expiresIn === undefined) return null;

  const minutes = Math.floor(expiresIn / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (expiresIn % 60).toString().padStart(2, "0");

  return (
    <>
    <TimerWrapper>
      <TimeText>{`${minutes}:${seconds}`}</TimeText>
      <ExtendButton type="button" onClick={() => dispatch(reissueToken())}>
        연장
      </ExtendButton>
    </TimerWrapper>
     {/* 5분 전 모달 */}
      <StyledModal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <SectionTitle>자동 로그아웃 안내</SectionTitle>

          <RemainRow>
            로그아웃까지 남은 시간&nbsp;:&nbsp;
            <RemainSec>{expiresIn}</RemainSec>초
          </RemainRow>

          <Description>
            
            잠시 후 자동으로 로그아웃될 예정입니다.<br />
            로그인 시간을 연장하시겠습니까?
          </Description>

          <BtnGroup>
            <RoundBtn variant="outline-secondary" onClick={handleLogout}>
              로그아웃
            </RoundBtn>
            <RoundBtn variant="primary" onClick={handleExtend}>
              로그인 연장
            </RoundBtn>
          </BtnGroup>
        </Modal.Body>
      </StyledModal>
    </>
  );
}

export default RefreshTokenTimer;

const TimerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 9999px;   
  padding: 0px 0px 0px 12px;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;
`;

const TimeText = styled.span`
  
`;

const ExtendButton = styled.button`
  all: unset;                      
  cursor: pointer;
  padding: 6px 16px;
  background:  #2d3282;            
  color: #ffffff;
  border-radius: 9999px;            
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  transition: background 0.15s;

  &:hover,
  &:focus-visible {
    background: #1f62d2;           
  }
`;

/* ===== 모달 ===== */
const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 12px;
    padding: 28px 32px;
    border: none;
    max-width: 480px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const SectionTitle = styled.p`
  margin: 0 0 12px;
  font-weight: 700;
  font-size: 14px;
  color: #ff3b30; /* 빨간 안내 글씨 */
`;

const RemainRow = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
`;

const RemainSec = styled.span`
  color: #0053ff; /* 파란 숫자 */
`;

const Description = styled.p`
  font-size: 14px;
  color: #4d4d4d;
  margin: 0 0 24px;
  line-height: 1.5;
`;

const BtnGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const RoundBtn = styled(Button)`
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 600;
  ${({ variant }) =>
    variant === "primary"
      ? css`
          background: #2763ff;
          border: none;
          &:hover,
          &:focus-visible {
            background: #1f52d2;
          }
        `
      : css`
          color: #4d4d4d;
          border: 1px solid #d1d1d1;
          &:hover,
          &:focus-visible {
            background: #f5f5f5;
            color: #4d4d4d;
          }
        `}
`;