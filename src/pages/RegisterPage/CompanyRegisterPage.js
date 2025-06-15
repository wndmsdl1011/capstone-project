import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkEmailAvailability,
  clearErrors,
  registerCompany,
  registerUser,
  resetEmailError,
  resetEmailMessage,
} from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faUser,
  faPhone,
  faBuilding,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
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
const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-top: 5px;
  font-size: 15px; /* 폰트 사이즈 살짝 조정 가능 */
  color: #333; /* 색상도 조정 가능 */
`;
const InputWrapper = styled.div`
  position: relative;
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
const Input = styled.input`
  width: 100%;
  padding: 12px 40px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;
const PhoneInput = styled.input`
  width: 110px;
  padding: 12px 0px;
  margin: 8px 0px 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
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

const EmailInput = styled.input`
  width: 73%;
  padding: 12px 40px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const EmailCheckButton = styled.button`
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

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 20px; /* 버튼 사이 거리 띄우기 */
  margin: 10px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;

  input {
    margin-right: 8px; /* 버튼과 텍스트 사이 간격 */
  }
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
  const { registrationError,emailmessage, checkEmailError } = useSelector((state) => state.user);
  // 사용자 입력값 저장 state
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [showResult, setShowResult] = useState(false); // 클릭 여부 추적
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
  const middleInputRef = useRef(null);
  const lastInputRef = useRef(null);
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
      checkPw: '',
      name: '',
      gender: 'MAN',
      phone: '',
      phoneMiddle: '',
      phoneLast: '',
      businessNumber: '',
      position: '인사담당자',
      companyName: '',
      companyLocation: address,
      role: 'PENDING',
      detailAddress: '',
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      if (!agreeTerms) {
        alert('서비스 이용약관 및 개인정보 처리방침에 동의해야 합니다.');
        return;
      }

      // 모든 유효성 검사 OK → 여기서 dispatch 등 처리
      console.log('회원가입 데이터:', values);
      dispatch(registerCompany({ values, navigate }));
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
  useEffect(() => {
    // 페이지 처음 들어올 때 초기화
    setIsEmailChecked(false);
    dispatch(clearErrors());
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (!isEmailChecked) {
      alert('이메일 중복 검사를 먼저 완료해주세요.');
      emailInputRef.current?.focus();
      return;
    }
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
      const newZonecode = data.zonecode || '';
      const newAddress = data.address || '';

      setZonecode(newZonecode);
      setAddress(newAddress);

      // Formik에 직접 반영
      formik.setFieldValue('companyLocation', newAddress);
    }
    setIsOpen(false);
  };

  // 모달 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };
  const checkEmail = async () => {
    const email = formik.values.email;

    // 이메일 빈값이거나 형식에 안 맞으면 alert 띄우기
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('이메일 형식에 맞게 입력해주세요.');
      return; // 더 이상 진행하지 않게 return
    }
    const result = await dispatch(checkEmailAvailability(formik.values.email));
    console.log('emailresult', result);
    if (result.payload?.status == 200) {
      // 서버 응답: false면 "존재하지 않는 이메일" = 사용 가능
      setIsEmailChecked(true);
    } else {
      // true면 "이미 존재하는 이메일" = 사용 불가
      setIsEmailChecked(false);
    }
  };
  const handleMiddleChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만
    if (value.length > 4) value = value.slice(0, 4);

    formik.setFieldValue('phoneMiddle', value);

    if (value.length === 4) {
      lastInputRef.current?.focus();
    }

    updateFullPhone(value, formik.values.phoneLast);
  };

  const handleLastChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);

    formik.setFieldValue('phoneLast', value);

    // middle + last 완성된 phone 업데이트
    updateFullPhone(formik.values.phoneMiddle, value);
  };

  const updateFullPhone = (middle, last) => {
    const middleFixed = middle || formik.values.phoneMiddle || '';
    const lastFixed = last || formik.values.phoneLast || '';

    const fullPhone = `010${middleFixed}${lastFixed}`;
    formik.setFieldValue('phone', fullPhone);
  };
  return (
    <Container>
      <SelectedTabStyle>기업회원</SelectedTabStyle>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <StyledLabel>이메일</StyledLabel>
          <InputWrapper>
            <StyledIcon icon={faEnvelope} />
            <EmailInput
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={formik.values.email}
              onChange={(e) => {
                setIsEmailChecked(false); // 이메일 수정하면 다시 중복검사해야 함
                formik.handleChange(e);
              }}
              ref={emailInputRef}
            />
            <EmailCheckButton type="button" onClick={checkEmail}>
              중복검사
            </EmailCheckButton>
          </InputWrapper>
          <div>{emailmessage}</div>
          <div style={{ color: 'red' }}>{checkEmailError}</div>
          <StyledLabel>비밀번호</StyledLabel>
          <InputWrapper>
            <StyledIcon icon={faLock} />
            <Input
              name="password"
              type="password"
              placeholder="비밀번호 (8자 이상)"
              value={formik.values.password}
              onChange={formik.handleChange}
              ref={pwInputRef}
            />
          </InputWrapper>
          <StyledLabel>비밀번호 확인</StyledLabel>
          <InputWrapper>
            <StyledIcon icon={faLock} />
            <Input
              name="checkPw"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formik.values.checkPw}
              onChange={formik.handleChange}
              ref={pwCheckInputRef}
            />
          </InputWrapper>
          <StyledLabel>이름</StyledLabel>
          <InputWrapper>
            <StyledIcon icon={faUser} />
            <Input
              name="name"
              type="text"
              placeholder="이름을 입력해주세요"
              value={formik.values.name}
              onChange={formik.handleChange}
              ref={nameInputRef}
            />
          </InputWrapper>
          <StyledLabel>성별</StyledLabel>
          <RadioGroup role="group" aria-labelledby="gender-radio-group">
            <RadioLabel>
              <input
                type="radio"
                name="gender"
                value="MAN"
                checked={formik.values.gender === 'MAN'}
                onChange={formik.handleChange}
              />
              남성
            </RadioLabel>

            <RadioLabel>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formik.values.gender === 'FEMALE'}
                onChange={formik.handleChange}
              />
              여성
            </RadioLabel>
          </RadioGroup>
          <StyledLabel>연락처</StyledLabel>
          <InputWrapper>
            
            <PhoneInput
              value="010"
              disabled
              style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}
            />
            <PhoneInput
              name="phoneMiddle"
              type="text"
              value={formik.values.phoneMiddle || ''}
              onChange={handleMiddleChange}
              maxLength={4}
              ref={middleInputRef}
            />
            <PhoneInput
              name="phoneLast"
              type="text"
              value={formik.values.phoneLast || ''}
              onChange={handleLastChange}
              maxLength={4}
              ref={lastInputRef}
            />
          </InputWrapper>
          <StyledLabel>사업자등록번호</StyledLabel>
          <InputWrapper>
            <StyledIcon icon={faLock} />
            <Input
              name="businessNumber"
              type="text"
              placeholder="예 : 123-12-12345 (-포함)"
              value={formik.values.businessNumber}
              onChange={formik.handleChange}
              ref={businessNumberInputRef}
            />
          </InputWrapper>
          <StyledLabel>회사명</StyledLabel>
          <InputWrapper>
            <StyledIcon icon={faBuilding} />
            <Input
              name="companyName"
              type="text"
              placeholder="회사 이름을 입력해주세요"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              ref={companyNameInputRef}
            />
          </InputWrapper>
          <div>
            <div>
              <StyledLabel>회사 주소</StyledLabel>
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
            <InputWrapper>
              <StyledIcon icon={faLocationDot} />
              <Input
                name="companyLocation"
                type="text"
                placeholder="회사 주소를 입력해주세요"
                value={formik.values.companyLocation}
                onChange={formik.handleChange}
                ref={companyLocationInputRef}
              />
            </InputWrapper>
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
              <Modal.Body style={{ height: '400px' }}>
                <DaumPostcodeEmbed
                  onComplete={completeHandler}
                  style={{ width: '100%', height: '100%' }}
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
