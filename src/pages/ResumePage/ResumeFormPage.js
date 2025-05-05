import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faBirthdayCake,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { resumeRegister, getResumeDetail, resumeUpdate } from '../../features/resume/resumeSlice';

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  background: #f9fbff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleInput = styled.input`
  font-size: 20px;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
  width: 70%;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;
const ToggleSwitch = styled.div`
  width: 50px;
  height: 26px;
  background-color: ${({ isPublic }) => (isPublic ? '#A7F3D0' : '#F87171')};
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const ToggleHandle = styled.div`
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ isPublic }) => (isPublic ? '26px' : '2px')};
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const SelectBox = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const FileDropZone = styled.div`
  border: 2px dashed #d1d5db;
  padding: 40px 0;
  text-align: center;
  border-radius: 12px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const SaveButton = styled.button`
  background-color: #5eead4;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2dd4bf;
  }
`;

const ResumeFormPage = () => {
  const { resumeId } = useParams();
  const { profile } = useSelector((state) => state.user);
  const { currentResume } = useSelector((state) => state.resume);
  const [isPublic, setIsPublic] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const techOptions = [
    'HTML',
    'CSS',
    'JAVASCRIPT',
    'TYPESCRIPT',
    'REACT',
    'VUE',
    'ANGULAR',
    'NEXTJS',
    'TAILWIND',
    'BOOTSTRAP',
    'JAVA',
    'SPRING',
    'SPRING_BOOT',
    'PYTHON',
    'DJANGO',
    'FLASK',
    'NODEJS',
    'EXPRESS',
    'MYSQL',
    'POSTGRESQL',
    'MONGODB',
    'ORACLE',
    'REDIS',
    'SQLITE',
    'DOCKER',
    'KUBERNETES',
    'AWS',
    'AZURE',
    'NGINX',
    'JENKINS',
    'GIT',
    'GITHUB_ACTIONS',
    'FLUTTER',
    'REACT_NATIVE',
    'SWIFT',
    'KOTLIN',
    'FIGMA',
    'POSTMAN',
    'JIRA',
    'SLACK',
    'NOTION',
    'INTELLIJ',
    'VS_CODE',
  ].map((tech) => ({ value: tech, label: tech }));

  const devOptions = [
    { value: 'BACKEND', label: '서버/백엔드 개발자' },
    { value: 'FRONTEND', label: '프론트엔드 개발자' },
    { value: 'FULLSTACK', label: '웹 풀스택 개발자' },
    { value: 'ANDROID', label: '안드로이드 개발자' },
    { value: 'IOS', label: 'iOS 개발자' },
    { value: 'CROSSPLATFORM', label: '크로스플랫폼 앱개발자' },
    { value: 'GAME_CLIENT', label: '게임 클라이언트 개발자' },
    { value: 'GAME_SERVER', label: '게임 서버 개발자' },
    { value: 'DBA', label: 'DBA' },
    { value: 'BIGDATA', label: '빅데이터 엔지니어' },
    { value: 'AI_ML', label: '인공지능/머신러닝' },
    { value: 'DEVOPS', label: 'devops/시스템 엔지니어' },
    { value: 'SECURITY', label: '정보보안 담당자' },
    { value: 'QA', label: 'QA 엔지니어' },
    { value: 'PM', label: '개발 PM' },
    { value: 'HW', label: 'HW/임베디드' },
    { value: 'SW', label: 'SW/솔루션' },
    { value: 'WEBPUBLISHER', label: '웹퍼블리셔' },
    { value: 'VR_AR', label: 'VR/AR/3D' },
    { value: 'BLOCKCHAIN', label: '블록체인' },
    { value: 'SUPPORT', label: '기술지원' },
  ];

  const formik = useFormik({
    initialValues: {
      title: '',
      intro: '',
      skills: [],
      githubUrl: '',
      visible: false,
      devposition: '',
    },
    onSubmit: async (values) => {
      const payload = {
        ...values,
        devposition: values.devposition === '' ? null : values.devposition,
      };

      console.log('이력서 저장데이터', payload);
      dispatch(resumeUpdate({ values: payload, resumeId }));
    },
  });

  useEffect(() => {
    if (resumeId) {
      dispatch(getResumeDetail(resumeId));
    }
  }, [dispatch, resumeId]);

  useEffect(() => {
    if (currentResume && resumeId) {
      formik.setValues({
        title: currentResume.title || '',
        intro: currentResume.intro || '',
        skills: currentResume.skills || [],
        githubUrl: currentResume.githubUrl || '',
        visible: currentResume.visible || false,
        devposition: currentResume.devposition || '',
      });
      setIsPublic(currentResume.visible || false);
    }
  }, [currentResume, resumeId]);

  const handleToggle = () => {
    const newValue = !isPublic;
    setIsPublic(newValue);
    formik.setFieldValue('visible', newValue); // formik에도 반영
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Header>
          <TitleInput
            name="title"
            type="text"
            placeholder="이력서 제목을 입력해주세요"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          <ToggleWrapper>
            <ToggleLabel>공개 범위</ToggleLabel>
            <ToggleSwitch isPublic={isPublic} onClick={handleToggle}>
              <ToggleHandle isPublic={isPublic} />
            </ToggleSwitch>
          </ToggleWrapper>
        </Header>

        <Section>
          <Label>
            <strong>기본 스펙</strong>
          </Label>
          <p>
            이름 : {profile?.name}({profile?.gender})
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} /> {profile?.email}
          </p>
          <p>
            <FontAwesomeIcon icon={faBirthdayCake} /> {profile?.birthYear}년생
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} /> {profile?.phone}
          </p>
        </Section>

        <Section>
          <Label>간단 소개</Label>
          <Input
            name="intro"
            type="text"
            placeholder="간단 소개를 입력해주세요"
            value={formik.values.intro}
            onChange={formik.handleChange}
          />
        </Section>

        <Section>
          <Label>개발 직무</Label>
          <Select
            name="devposition"
            options={devOptions}
            value={devOptions.find(
              (opt) => opt.value === formik.values.devposition
            )}
            onChange={(option) =>
              formik.setFieldValue('devposition', option?.value)
            }
            placeholder="개발 직무 검색 및 선택"
          />
        </Section>

        <Section>
          <Label>기술 스택</Label>
          <Select
            isMulti
            name="skills"
            options={techOptions}
            classNamePrefix="select"
            value={techOptions.filter((option) =>
              formik.values.skills.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              formik.setFieldValue(
                'skills',
                selectedOptions.map((option) => option.value)
              )
            }
            placeholder="기술 스택 검색 및 선택"
          />
        </Section>

        <Section>
          <Label>GitHub 링크</Label>
          <Input
            name="githubUrl"
            type="text"
            placeholder="https://github.com/yourprofile"
            value={formik.values.githubUrl}
            onChange={formik.handleChange}
          />
        </Section>

        <Section>
          <Label>파일 첨부</Label>
          <FileDropZone>
            여기에 파일을 끌어다 놓거나 <br />
            <strong style={{ color: '#3730a3', cursor: 'pointer' }}>
              파일 선택하기
            </strong>
          </FileDropZone>
        </Section>

        <SaveButton type="submit">저장하기</SaveButton>
      </form>
    </Container>
  );
};

export default ResumeFormPage;
