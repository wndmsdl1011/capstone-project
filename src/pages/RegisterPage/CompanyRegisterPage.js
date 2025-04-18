import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 상단에서 시작 */
  min-height: 100vh;
  height: auto;
  background: #f8f6ff;
  padding: 30px 5px; /* 전체적인 패딩 추가 */
`;

const SelectedTabStyle = styled.div`
  color: #2D3282;
  font-size: 18px;
  font-weight: bold;
  position: relative;
  padding: 10px 20px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 25%;
    width: 50%;
    height: 2px;
    background: #2D3282;
  }
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  background: #9333ea;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 16px;
`;

const CompanyRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 사용자 입력값 저장 state
  const [userName, setUserName] = useState(""); // 유저 이름
  const [email, setEmail] = useState(""); // 이메일
  const [userPassword, setUserPassword] = useState(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [gender, setGender] = useState("남성"); // 기본값: 남성
  // const [birth_date, setBirthDate] = useState(""); // 생년월일
  const [age, setAge] = useState(0); // 나이
  const [major, setMajor] = useState(""); // 전공
  const [nickname, setNickname] = useState(""); // 닉네임
  const [contact, setContact] = useState(""); // 연락 수단단
  const [location, setLocation] = useState(""); // 지역
  const [agreeTerms, setAgreeTerms] = useState(false); // 이용약관 동의 상태
  const [testResponse, setTestResponse] = useState(""); // 🔹 백엔드 응답을 저장할 상태 추가
  const [contactMethod, setContactMethod] = useState("phone");
  const placeholders = {
    phone: "전화번호를 입력하세요.",
    instagram: "인스타 ID를 입력하세요.",
    kakao: "카카오톡 ID를 입력하세요.",
  };

  // 이메일 유효성 검사 함수
  const validateEmail = (email) => email.endsWith("@bu.ac.kr");

  // 회원가입 버튼 클릭 시 실행되는 함수
  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 방지

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      alert("올바른 학교 이메일을 입력하세요 (예: example@bu.ac.kr). ");
      return;
    }

    // 비밀번호 길이 검사
    if (userPassword.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 확인 검사
    if (userPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이용약관 동의 확인
    if (!agreeTerms) {
      alert("서비스 이용약관 및 개인정보 처리방침에 동의해야 합니다.");
      return;
    }

    // JSON 형식으로 콘솔 출력
    console.log(
      JSON.stringify(
        {
          email,
          username: userName,
          password: userPassword,
          gender,
          age,
          major,
          nickname,
          contact,
          location,
          role: "USER",
        },
        null,
        2
      )
    );

    // Redux 이용
    dispatch(
      registerUser({
        email,
        userName,
        userPassword,
        gender,
        age,
        major,
        nickname,
        contact,
        location,
        navigate,
      })
    );
  };

  return (
    <Container>
      <SelectedTabStyle>
        기업회원
      </SelectedTabStyle>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="이름"
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="학교 이메일"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={userPassword}
            required
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </Select>
          <Input
            type="number"
            placeholder="나이"
            value={age}
            required
            onChange={(e) => setAge(e.target.value)}
          />
          <Input
            type="text"
            placeholder="전공"
            value={major}
            required
            onChange={(e) => setMajor(e.target.value)}
          />
          <Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            required
            onChange={(e) => setNickname(e.target.value)}
          />
          <Select
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            required
          >
            <option value="phone">전화번호</option>
            <option value="instagram">인스타그램</option>
            <option value="kakao">카카오톡</option>
          </Select>
          <Input
            type="text"
            placeholder={placeholders[contactMethod]}
            value={contact}
            required
            onChange={(e) => setContact(e.target.value)}
          />
          <Input
            type="text"
            placeholder="지역"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
          />
          <CheckboxContainer>
            <input
              type="checkbox"
              checked={agreeTerms}
              required
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label>서비스 이용약관 및 개인정보 처리방침에 동의합니다.</label>
          </CheckboxContainer>
          <Button type="submit">회원가입</Button>
        </form>
      </FormWrapper>
      <br />
      <p>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </Container>
  );
};

export default CompanyRegisterPage;
