import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearErrors,
  fetchUserProfile,
  loginWithEmail,
} from '../../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faBuilding, faUser  } from '@fortawesome/free-solid-svg-icons';

const Logo = styled.div`
  text-align: center;
  margin-bottom: 10px;
  font-size: 34px;
  color: #2d3282;
  font-weight: bold;

  span {
    font-size: 14px;
    font-weight: normal;
    margin: 0 2px;
    color: #2d3282;
  }
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background:#F8F9FF;
  padding: 30px 5px;
  perspective: 1200px;
`;

const MemberTypeToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 10px;
  width:450px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 0px;
`;

const ToggleButton = styled.button`
  background: none;
  width:200px;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  padding: 10px 20px;
  margin-left: 20px;
  margin-right: 20px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;
  font-weight: normal; /* 글씨 굵기 기본 */

  ${({ active }) =>
    active &&
    css`
      color: #2d3282;
      background-color: #E6EEFF;
    `}

  ${({ active }) =>
    !active &&
    css`
      &:hover {
        color: #2d3282;
        background-color: #E6EEFF;
      }
    `}
`;

const CardWrapper = styled.div`
  width: 90%;
  max-width: 450px;
  height: auto;
  position: relative;
  perspective: 1200px;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.5s ease-in-out;
  transform-style: preserve-3d;
  transform: ${({ isBusiness }) =>
    isBusiness ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CardFront = styled(CardFace)`
  z-index: 2;
`;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);

`;
const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px; /* 입력창과 라벨 사이 여백 */
  font-size: 15px; /* 폰트 사이즈 살짝 조정 가능 */
  color: #333; /* 색상도 조정 가능 */
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #adb5bd; // 회색
  font-size: 18px;
  pointer-events: none; // 아이콘 위 클릭 막기 (옵션)
`;

const Button = styled.button`
  width: 100%;
  background: #2D3282;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('personal');
  // const [role, setRole] = useState("USER");
  const { user, loginError } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [loginError, dispatch]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    console.log(password);
    const role = userType === 'business' ? 'COMPANY' : 'USER';
    console.log('role', role);
    dispatch(loginWithEmail({ email, password, role, navigate }));
  };

  // if (user) {
  //   navigate("/");
  // }

  const isBusiness = userType === 'business';
  const registerText = isBusiness ? '기업 회원가입' : '개인 회원가입';
  const registerLink = isBusiness ? '/register/company' : '/register/personal';

  return (
    <Container>
      <Logo>
    J<span>ob</span> M<span>iddle</span> P<span>latform</span>
  </Logo>
      <MemberTypeToggle>
        <ToggleButton
          active={userType === 'personal'}
          onClick={() => setUserType('personal')}
        >
          <InputWrapper>
          <FontAwesomeIcon icon={faUser} style={{marginRight:10}}/>
          일반 사용자
          </InputWrapper>
        </ToggleButton>
        <ToggleButton
          active={userType === 'business'}
          onClick={() => setUserType('business')}
        >
          <FontAwesomeIcon icon={faBuilding} style={{marginRight:10}}/>
          기업 담당자
        </ToggleButton>
      </MemberTypeToggle>

      {loginError && <ErrorMessage>{loginError}</ErrorMessage>}

      <CardWrapper>
        <CardInner isBusiness={isBusiness}>
          {/* 앞면 - 개인회원 */}
          <CardFront>
            <form onSubmit={handleLoginWithEmail}>
            <StyledLabel htmlFor="email">이메일</StyledLabel>
            <InputWrapper>
            
            <StyledIcon icon={faEnvelope} />
              <Input
                type="email"
                placeholder={'이메일을 입력해주세요'}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              </InputWrapper>
              <StyledLabel htmlFor="email">비밀번호</StyledLabel>
              <InputWrapper>
              <StyledIcon icon={faLock} />
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              </InputWrapper>
              <Button type="submit" isBusiness={false}>
                로그인
              </Button>
            </form>
            <p>
              계정이 없다면? <Link to={registerLink}>{registerText}</Link>
            </p>

            
          </CardFront>

          {/* 뒷면 - 기업회원 */}
          <CardBack>
            <form onSubmit={handleLoginWithEmail}>
            <StyledLabel htmlFor="email">이메일</StyledLabel>
            <InputWrapper>
            <StyledIcon icon={faEnvelope} />
              <Input
                type="email"
                placeholder="이메일을 입력해주세요"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              </InputWrapper>
              <StyledLabel htmlFor="email">비밀번호</StyledLabel>
              <InputWrapper>
              <StyledIcon icon={faLock} />
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              </InputWrapper>
              <Button type="submit" isBusiness={true}>
                로그인
              </Button>
            </form>
            <p>
              계정이 없다면? <Link to={registerLink}>{registerText}</Link>
            </p>
          </CardBack>
        </CardInner>
      </CardWrapper>
    </Container>
  );
};

export default LoginPage;
