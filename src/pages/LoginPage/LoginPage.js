import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginWithEmail } from "../../features/user/userSlice";
import { useNavigate, Link } from "react-router-dom";
import styled, { css } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: #E6EEFF;
  padding: 30px 5px;
  perspective: 1200px;
`;

const MemberTypeToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  padding: 10px 20px;
  color: #888;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  ${({ active }) =>
    active &&
    css`
      color: #2D3282;
      font-weight: bold;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 25%;
        width: 50%;
        height: 2px;
        background: #2D3282;
      }
    `}

  ${({ active }) =>
    !active &&
    css`
      &:hover {
        color: #2D3282;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 25%;
          width: 50%;
          height: 2px;
          background: #2D3282;
        }
      }
    `}
`;

const CardWrapper = styled.div`
  width: 90%;
  max-width: 400px;
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
    isBusiness ? "rotateY(180deg)" : "rotateY(0deg)"};
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
  background: #2D3282;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  background: ${({ isBusiness }) => (isBusiness ? "#E6EEFF" : "#2D3282")};
  color: ${({ isBusiness }) => (isBusiness ? "#2D3282" : "white")};
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 16px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [userType, setUserType] = useState("personal");

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
    dispatch(loginWithEmail({ email, userPassword }));
  };

  if (user) {
    navigate("/");
  }

  const isBusiness = userType === "business";
  const registerText = isBusiness ? "기업 회원가입" : "개인 회원가입";
  const registerLink = isBusiness ? "/register/company" : "/register/personal";

  return (
    <Container>
      <MemberTypeToggle>
        <ToggleButton
          active={userType === "personal"}
          onClick={() => setUserType("personal")}
        >
          개인회원
        </ToggleButton>
        <ToggleButton
          active={userType === "business"}
          onClick={() => setUserType("business")}
        >
          기업회원
        </ToggleButton>
      </MemberTypeToggle>

      {loginError && <ErrorMessage>{loginError}</ErrorMessage>}

      <CardWrapper>
        <CardInner isBusiness={isBusiness}>
          {/* 앞면 - 개인회원 */}
          <CardFront>
            <form onSubmit={handleLoginWithEmail}>
              <Input
                type="email"
                placeholder="아이디"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="비밀번호"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" isBusiness={false}>로그인</Button>
            </form>
            <p>
              계정이 없다면? <Link to={registerLink}>{registerText}</Link>
            </p>
          </CardFront>

          {/* 뒷면 - 기업회원 */}
          <CardBack>
            <form onSubmit={handleLoginWithEmail}>
              <Input
                type="email"
                placeholder="아이디"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="비밀번호"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" isBusiness={true}>로그인</Button>
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
