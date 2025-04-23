import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompany, registerUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { Modal, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
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
  color: #2d3282;
  font-size: 18px;
  font-weight: bold;
  position: relative;
  padding: 10px 20px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 25%;
    width: 50%;
    height: 2px;
    background: #2d3282;
  }
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 420px;
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

const AddressInput = styled.input`
width: 73%;
padding: 12px;
margin: 8px 0;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 16px;
`;

const AddressButton = styled.button`
width: 25%;
padding: 12px;
margin: 8px 2px 0;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 13px;

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

const RegisterButton = styled.button`
  width: 100%;
  background: #2d3282;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 16px;
`;

const PersonalRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {emailmessage} = useSelector((state)=>state.user.emailmessage)
  // 사용자 입력값 저장 state
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false); // 이용약관 동의 상태
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const pwInputRef = useRef(null);
  const pwCheckInputRef = useRef(null);
  const businessNumberInputRef = useRef(null);
  const companyNameInputRef = useRef(null);
  const companyLocationInputRef = useRef(null);
  const validationSchema = Yup.object({
    name: Yup.string().min(2, '이름은 최소 2글자 입니다.').required('Required'),

    email: Yup.string()
      .email('이메일 입력 형식이 올바르지 않습니다. 확인 후, 다시 입력하세요.')
      .required('Required'),

    password: Yup.string()
      .max(16, '비밀번호는 최대 16자리입니다!')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}[^\s]*$/,
        '알파벳, 숫자, 공백을 제외한 특수문자를 모두 포함한 8자리 이상 입력해주세요'
      )
      // .matches(regexPasswd, '비밀번호를 8~16자로 영문 대소문자, 숫자, 특수기호를 조합해서 사용하세요.')
      .required('비밀번호를 입력해주세요'),
    checkPw: Yup.string()
      .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다') // 두 비밀번호 비교 함수수
      .required('비밀번호를 한번 더 입력해주세요'),

    companyLocation: Yup.string().required('주소를 선택하세요'),

    businessNumber: Yup.string()
    .min(12, '사업자등록번호는 - 제외 10자리 입니다.')
    .max(12, '사업자등록번호는 - 제외 10자리 입니다.')
    .required('사업자등록번호를 입력해주세요.'),

    companyName: Yup.string().required('회사명을 입력해주세요.'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      checkPw:'',
      name: '',
      gender: 'MAN',
      phone: '',
      businessNumber:'',
      position: "인사담당자",
      companyName: "",
      companyLocation: address,
      role: "PENDING",
      detailAddress:""
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      if (!agreeTerms) {
        alert('서비스 이용약관 및 개인정보 처리방침에 동의해야 합니다.');
        return;
      }

      // 모든 유효성 검사 OK → 여기서 dispatch 등 처리
      console.log('회원가입 데이터:', values);
      dispatch(registerCompany({values, navigate}));
    },
    validateOnBlur: true,
    validateOnChange: false,
  });
  // const ErrorMessageComponent = (props) => <span role="alert" {...props} />;

  // 회원가입 버튼 클릭 시 실행되는 함수

  // https://velog.io/@win/react-hook-form-yup-%EC%9C%A0%ED%9A%A8%EC%84%B1-%EA%B2%80%EC%82%AC%ED%95%98%EA%B8%B0
  //https://choisuhyeok.tistory.com/73
  //https://velog.io/@seeh_h/%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EB%BD%80%EA%B0%9C%EA%B8%B0-Formik
  //따라서 formik 하나만으로 여러개의 input 상태에 대한 제어가 가능하다. 이렇게 여러개의 input이 추가되더라도 formik 하나로 form 전체를 관리할 수 있는 것이 formik의 장점이다.
  // 막 target.value이용해서 state로 관리해야하고 코드가 많아지는데, state 필요 없다.
  //이 라이브러리 쓰면 코드가 상당히 감축됨, yup이란 유효성 검사(이메일, 비번형식) 라이브러리도 있어서 굿굿
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();

    if (errors.name) {
      alert(errors.name);
      nameInputRef.current?.focus();
      return;
    }
    if (errors.email) {
      alert(errors.email);
      emailInputRef.current?.focus();
      return;
    }
    if (errors.password) {
      alert(errors.password);
      pwInputRef.current?.focus();
      return;
    }
    if (errors.checkPw) {
      alert(errors.checkPw);
      pwCheckInputRef.current?.focus();
      return;
    }
    if (errors.businessNumber) {
      alert(errors.businessNumber);
      businessNumberInputRef.current?.focus();
      return;
    }
    if (errors.companyName) {
      alert(errors.companyName);
      companyNameInputRef.current?.focus();
      return;
    }
    if (errors.companyLocation) {
      alert(errors.companyLocation);
      companyLocationInputRef.current?.focus();
      return;
    }
    formik.handleSubmit();
  };
  // console.log("user", user);

   // 모달 열기
  const toggleHandler = () => {
    setIsOpen(true);
  };

  // 주소 선택 완료 시
  const completeHandler = (data) => {
    if (data) {
      const newZonecode = data.zonecode || "";
      const newAddress = data.address || "";
  
      setZonecode(newZonecode);
      setAddress(newAddress);
  
      // Formik에 직접 반영
      formik.setFieldValue("companyLocation", newAddress);
    }
    setIsOpen(false);
  };

  // 모달 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };
  // const checkEmail = () => {
  //   checkEmailAvailability();
  //   console.log(emailmessage);
  // }
  
  return (
    <Container>
      <SelectedTabStyle>기업회원</SelectedTabStyle>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            placeholder="이메일"
            value={formik.values.email}
            onChange={formik.handleChange}
            ref={emailInputRef}
          />
          {/* <AddressButton type="button" onClick={checkEmail}>
          중복검사
        </AddressButton> */}
        <div>{emailmessage}</div>
          <Input
            name="password"
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={formik.values.password}
            onChange={formik.handleChange}
            ref={pwInputRef}
          />
          <Input
            name="checkPw"
            type="password"
            placeholder="비밀번호 확인"
            value={formik.values.checkPw}
            onChange={formik.handleChange}
            ref={pwCheckInputRef}
          />
          <Input
            name="name"
            type="text"
            placeholder="이름"
            value={formik.values.name}
            onChange={formik.handleChange}
            ref={nameInputRef}
          />
          <Select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
          >
            <option value="MAN">남성</option>
            <option value="FEMALE">여성</option>
          </Select>

          <Input
            name="phone"
            type="text"
            placeholder="전화번호를 입력하세요."
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />

          <Input
            name="businessNumber"
            type="text"
            placeholder="사업자등록번호 / 예 : 123-12-12345 (-포함)" 
            value={formik.values.businessNumber}
            onChange={formik.handleChange}
            ref={businessNumberInputRef}
          />
          <Input
            name="companyName"
            type="text"
            placeholder="회사명"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            ref={companyNameInputRef}
          />
          <div>

          <div>
        <AddressInput
          name="zonecode"
          type="text"
          placeholder="우편번호"
          value={zonecode}
          onChange={formik.handleChange}
          ref={companyLocationInputRef}
        />
        <AddressButton type="button" onClick={toggleHandler}>
          주소 찾기
        </AddressButton>
      </div>

      <Input
        name="companyLocation"
        type="text"
        placeholder="주소"
        value={formik.values.companyLocation}
        onChange={formik.handleChange}
        ref={companyLocationInputRef}
      />
      {/* <Input
        name="detailAddress"
        type="text"
        placeholder="상세 주소"
        value={formik.values.detailAddress}
        onChange={formik.handleChange}
        ref={companyLocationInputRef}
      /> */}

          
      <Modal show={isOpen} onHide={closeHandler} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>주소 검색</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "400px" }}>
          <DaumPostcodeEmbed
            onComplete={completeHandler}
            style={{ width: "100%", height: "100%" }}
          />
        </Modal.Body>
      </Modal>

      </div>
    

          <CheckboxContainer>
            <input
              type="checkbox"
              checked={agreeTerms}
              required
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label>서비스 이용약관 및 개인정보 처리방침에 동의합니다.</label>
          </CheckboxContainer>
          <RegisterButton type="submit">회원가입</RegisterButton>
        </form>
      </FormWrapper>
      <br />
      <p>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </Container>
  );
};

export default PersonalRegisterPage;
