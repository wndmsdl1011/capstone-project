import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faBirthdayCake,
  faPhone,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getResumeDetail, resumeUpdate } from '../../features/resume/resumeSlice';

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
const FlexRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;


const ProfileImageBox = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 12px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const Image = styled.img`
  width: 84%;
  height: 100%;
  object-fit: cover;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const SpecInfo = styled.div`
  flex: 1;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #10b981;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const ProjectItem = styled.div`
  
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  position: relative;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const ProjectInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 18px;
  &::placeholder {  
    font-weight: 1000; 
  }
`;

const ProjectDetailInput = styled.input`
  width:100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  ::placeholder {
    color: #9ca3af;
    
  }
`;

const PlaceholderText = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  margin-bottom: 12px;
`;

const DeleteButton = styled.button`
  margin-left: 8px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    color: #ef4444;
  }
`;
// const DeleteButton = styled.button`
//   background: none;
//   border: none;
//   color: #9ca3af;
//   cursor: pointer;

//   &:hover {
//     color: #ef4444;
//   }
// `;
const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
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
  const { currentResume, newResume } = useSelector((state) => state.resume);
  const [isPublic, setIsPublic] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
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
      introduce: '',
      projects: []
    },
    onSubmit: async (values) => {

      console.log('이력서 저장데이터', values);
      dispatch(resumeUpdate({ values, imageFile, resumeId, navigate }));
    },
  });

  useEffect(() => {
    if (resumeId && newResume == false) {
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
        introduce: currentResume.introduce || '',
        projects: currentResume.projects || [],
      });
      setIsPublic(currentResume.visible || false);
      setImageFile(currentResume.img || null);
    }
  }, [currentResume, resumeId]);

  const handleToggle = () => {
    const newValue = !isPublic;
    setIsPublic(newValue);
    formik.setFieldValue('visible', newValue); // formik에도 반영
  };
  const handleAddProject = () => {
    const newProject = { name: '', description: '', techStack: [], githubLink: '' };
    formik.setFieldValue('projects', [...formik.values.projects, newProject]);
  };

  const handleRemoveProject = (index) => {
    const updated = [...formik.values.projects];
    updated.splice(index, 1);
    formik.setFieldValue('projects', updated);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 파일 크기 확인 (10MB = 10 * 1024 * 1024 = 10485760 bytes)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    //파일 사이즈 아직 미정 현재는 2.8mb도 안들어감.
    if (file.size > MAX_SIZE) {
      alert("파일 크기가 10MB를 초과할 수 없습니다. 10MB 이하로 업로드해주세요.");
      return;
    }
    setImageFile(file);
    // 미리보기용 base64 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
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
          <FlexRow>
            <ProfileImageBox>
              <UploadLabel htmlFor="photo-upload">
                {preview ? (
                  <Image src={preview} alt="프로필 미리보기" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} size="lg" />
                    <span>사진추가</span>
                    <small style={{ fontSize: '12px' }}>1:1 비율 권장</small>
                  </>
                )}
              </UploadLabel>
              <FileInput id="photo-upload" type="file" accept="image/*" onChange={handleImageChange} />
            </ProfileImageBox>

            <SpecInfo>
              {/* <p><strong>기본 스펙</strong></p> */}
              <p style={{ fontSize: '22px' }}><strong>{profile?.name} ({profile?.gender})</strong></p>
              <p><FontAwesomeIcon icon={faEnvelope} /> {profile?.email}</p>
              <p><FontAwesomeIcon icon={faBirthdayCake} /> {profile?.birthYear}년생</p>
              <p><FontAwesomeIcon icon={faPhone} /> {profile?.phone}</p>
            </SpecInfo>
          </FlexRow>
        </Section>

        <Section>
          <Label><strong>간단 소개</strong></Label>
          <Input
            name="intro"
            type="text"
            placeholder="간단 소개를 입력해주세요"
            value={formik.values.intro}
            onChange={formik.handleChange}
          />
        </Section>

        <Section>
          <Label><strong>개발 직무</strong></Label>
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
          <Label><strong>기술 스택</strong></Label>
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
          <Label><strong>GitHub 링크</strong></Label>
          <Input
            name="githubUrl"
            type="text"
            placeholder="https://github.com/yourprofile"
            value={formik.values.githubUrl}
            onChange={formik.handleChange}
          />
        </Section>

        <Section>

          <FlexBetween>
            <Label><strong>프로젝트</strong></Label>
            <AddButton type="button" onClick={handleAddProject}>
              <FontAwesomeIcon icon={faPlus} /> 프로젝트 추가
            </AddButton>
          </FlexBetween>
          <ProjectList>
            {formik.values.projects.map((project, idx) => (
              <ProjectItem key={idx}>
                <Row>
                  <ProjectInput
                    type="text"
                    name={`projects[${idx}].name`}
                    placeholder="*프로젝트명을 입력해주세요"
                    value={project.name}
                    onChange={formik.handleChange}
                  />
                  <DeleteButton type="button" onClick={() => handleRemoveProject(idx)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </DeleteButton>
                </Row>

                <ProjectDetailInput
                  type="text"
                  name={`projects[${idx}].description`}
                  placeholder="프로젝트 상세내용을 작성해주세요"
                  value={project.description}
                  onChange={formik.handleChange}
                />



                <Select
                  isMulti
                  name={`projects[${idx}].techStack`}
                  options={techOptions}
                  classNamePrefix="select"
                  value={techOptions.filter((option) =>
                    project.techStack.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    const updatedProjects = [...formik.values.projects];
                    updatedProjects[idx].techStack = selectedOptions.map((opt) => opt.value);
                    formik.setFieldValue('projects', updatedProjects);
                  }}
                  placeholder="기술스택을 등록해주세요"

                />

                <Label style={{ marginTop: "7px" }}>깃허브 링크</Label>
                <Input
                  type="text"
                  name={`projects[${idx}].githubLink`}
                  placeholder="http://, https:// 를 포함해 작성해주세요"
                  value={project.githubLink}
                  onChange={formik.handleChange}
                />
              </ProjectItem>
            ))}
          </ProjectList>

        </Section>

        <Section>
          <Label><strong>자기소개서</strong></Label>
          <TextArea
            name="introduce"
            type="text"
            placeholder="자기소개서 내용을 작성해주세요"
            value={formik.values.introduce}
            onChange={formik.handleChange}
          />
        </Section>

        <SaveButton type="submit">저장하기</SaveButton>
      </form>
    </Container>
  );
};

export default ResumeFormPage;
