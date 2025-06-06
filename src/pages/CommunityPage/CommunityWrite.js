import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaRegFileAlt } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import {
  CreateBoard,
  fetchBoardDetail,
  UpdateBoard,
} from '../../features/community/communitySlice';
import DateSelectModal from './Modal/DateSelectModal';

const boardType = [
  { value: 'GENERAL', label: ' 일반 글' },
  { value: 'PROJECT_RECRUIT', label: ' 프로젝트 글' },
  { value: 'STUDY_RECRUIT', label: ' 스터디 글' },
];

const categoryOptions = [
  { value: 'INDUSTRY_NEWS', label: '업계소식' },
  { value: 'INTRODUCTION', label: '자기소개' },
  { value: 'DISCUSSION', label: '의견공유' },
  { value: 'QUESTION', label: '질문' },
  { value: 'REVIEW', label: '후기' },
  { value: 'TIPS', label: '팁공유' },
  { value: 'DAILY_LIFE', label: '일상' },
  { value: 'COMMUNICATION', label: '소통' },
  { value: 'EMPATHY', label: '공감' },
  { value: 'RECOMMENDATION', label: '추천' },
  { value: 'INFORMATION', label: '정보' },
];

const techOptions = [
  'JAVA',
  'PYTHON',
  'CSS',
  'HTML',
  'REACT',
  'VUE',
  'ANGULAR',
  'NEXTJS',
  'TYPESCRIPT',
  'JAVASCRIPT',
  'NODEJS',
  'EXPRESS',
  'SPRING',
  'SPRING_BOOT',
  'DJANGO',
  'FLASK',
  'MYSQL',
  'POSTGRESQL',
  'MONGODB',
  'AWS',
  'KUBERNETES',
  'DOCKER',
  'GIT',
  'FIGMA',
].map((tech) => ({ value: tech, label: tech }));

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 780px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #374151;
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

// const Select = styled.select`
//   width: 100%;
//   padding: 0.5rem;
//   border: 1px solid #e5e7eb;
//   border-radius: 0.375rem;
//   background-color: white;
//   &:focus {
//     outline: none;
//     border-color: #2d3282;
//   }
// `;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  &:focus {
    outline: none;
    border-color: #2d3282;
  }
`;
const DateInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6eeff; /* hover 시 배경색 */
    border-color: #2d3282;
  }

  &:focus {
    outline: none;
    border-color: #2d3282;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  min-height: 200px;
  resize: none;
  &:focus {
    outline: none;
    border-color: #2d3282;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  background-color: #2d3282;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: #242868;
  }

  svg {
    margin-right: 6px;
  }
`;

const SelectWrapper = styled.div`
  margin-top: 1rem;
`;

const CommunityWrite = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    boardType: 'GENERAL',
    tags: [],
    title: '',
    description: '',
    recruitCount: '',
    requiredSkills: [],
    projectStartDate: '',
    projectEndDate: '',
    // projectCurriculum: '',
    projectWarning: '',
    studyStartDate: '',
    studyEndDate: '',
    studyCurriculum: '',
    studyWarning: '',
    applyMethod: '',
  });

  const isEditMode = Boolean(boardId);
  
  // 게시글 수정 시 데이터 불러오기
  useEffect(() => {
    console.log('boardId ', boardId);
    if (isEditMode) {
      dispatch(fetchBoardDetail({ boardId })).then((res) => {
        const data = res.payload;
        setInitialValues({
          boardType: data.boardType,
          title: data.title,
          description: data.description,
          recruitCount: data.recruitCount || '',
          requiredSkills:
            data.requiredSkills?.map((skill) => ({
              label: skill,
              value: skill,
            })) || [],
          projectStartDate: data.projectStartDate || '',
          projectEndDate: data.projectEndDate || '',
          projectWarning: data.projectWarning || '',
          studyStartDate: data.studyStartDate || '',
          studyEndDate: data.studyEndDate || '',
          studyCurriculum: data.studyCurriculum || '',
          studyWarning: data.studyWarning || '',
          applyMethod: data.applyMethod || '',
          tags: data.tags?.map((cat) => ({ label: cat, value: cat })) || [],
        });
      });
    }
  }, [boardId, dispatch]);

  const handleSubmit = (values) => {
    const base = {
      boardType: values.boardType,
      title: values.title,
      description: values.description,
    };

    let postData = {};

    if (values.boardType === 'PROJECT_RECRUIT') {
      postData = {
        ...base,
        recruitCount: values.recruitCount,
        projectStartDate: values.projectStartDate,
        projectEndDate: values.projectEndDate,
        projectWarning: values.projectWarning,
        requiredSkills: values.requiredSkills.map((s) => s.value),
        applyMethod: values.applyMethod,
      };
    } else if (values.boardType === 'STUDY_RECRUIT') {
      postData = {
        ...base,
        recruitCount: values.recruitCount,
        studyStartDate: values.studyStartDate,
        studyEndDate: values.studyEndDate,
        studyCurriculum: values.studyCurriculum,
        studyWarning: values.studyWarning,
        applyMethod: values.applyMethod,
      };
    } else {
      // GENERAL 글의 경우
      postData = {
        ...base,
        tags: values.tags.map((c) => c.value),
      };
    }

    console.log('최종 전송 데이터:', postData);
    if (isEditMode) {
      dispatch(UpdateBoard({ postData, boardId, navigate }));
    } else {
      dispatch(CreateBoard({ postData, navigate }));
    }
  };

  return (
    <Container>
      <Card>
        <TopBar>
          <BackButton onClick={() => navigate('/community')}>
            <FaArrowLeft style={{ marginRight: '6px' }} />
            목록으로 돌아가기
          </BackButton>
          <Title>게시글 작성</Title>
        </TopBar>

        <Formik
          // initialValues={{
          //   boardType: 'GENERAL',
          //   tags: [],
          //   title: '',
          //   description: '',
          //   recruitCount: '',
          //   requiredSkills: [],
          //   projectSchedule: '',
          //   projectCurriculum: '',
          //   projectWarning: '',
          //   studySchedule: '',
          //   studyCurriculum: '',
          //   studyWarning: '',
          //   applyMethod: null,
          // }}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <RadioGroup>
                {boardType.map((type) => (
                  <label key={type.value}>
                    <Field type="radio" name="boardType" value={type.value} />
                    {type.label}
                  </label>
                ))}
              </RadioGroup>
              {values.boardType === 'GENERAL' && (
                <>
                  <Label>카테고리</Label>
                  <SelectWrapper>
                    <Select
                      isMulti
                      name="tags"
                      options={categoryOptions}
                      placeholder="카테고리를 선택해주세요"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={values.tags}
                      onChange={(selected) => setFieldValue('tags', selected)}
                    />
                  </SelectWrapper>
                  <Label>제목</Label>
                  <Field
                    as={Input}
                    type="text"
                    name="title"
                    placeholder="제목을 입력해주세요"
                  />

                  <Label>내용</Label>
                  <Field
                    as={TextArea}
                    name="description"
                    placeholder="내용을 입력해주세요"
                  />
                </>
              )}

              {values.boardType === 'PROJECT_RECRUIT' && (
                <>
                  <Label>제목</Label>
                  <Field
                    as={Input}
                    type="text"
                    name="title"
                    placeholder="제목을 입력해주세요"
                  />

                  <Label>내용</Label>
                  <Field
                    as={TextArea}
                    name="description"
                    placeholder="내용을 입력해주세요"
                  />
                  <Label>프로젝트 일정</Label>
                  <div className="flex items-center gap-2">
                    <DateInput
                      readOnly
                      value={`${values.projectStartDate || '시작일'} ~ ${
                        values.projectEndDate || '종료일'
                      }`}
                      onClick={() => setProjectModalOpen(true)}
                    />
                  </div>
                  <DateSelectModal
                    isOpen={projectModalOpen}
                    onClose={() => setProjectModalOpen(false)}
                    startDate={
                      values.projectStartDate
                        ? new Date(values.projectStartDate)
                        : null
                    }
                    endDate={
                      values.projectEndDate
                        ? new Date(values.projectEndDate)
                        : null
                    }
                    onChange={(date, type) => {
                      const formatted = date?.toISOString().split('T')[0];
                      if (type === 'start')
                        setFieldValue('projectStartDate', formatted);
                      else setFieldValue('projectEndDate', formatted);
                    }}
                  />

                  <Label>모집 인원</Label>
                  <Field
                    as={Input}
                    name="recruitCount"
                    type="number"
                    placeholder="숫자로 입력해주세요"
                  />

                  <Label>필요 기술</Label>
                  <Select
                    isMulti
                    options={techOptions}
                    name="requiredSkills"
                    value={values.requiredSkills}
                    onChange={(selected) =>
                      setFieldValue('requiredSkills', selected)
                    }
                  />

                  <Label>프로젝트 관련 주의사항</Label>
                  <Field
                    as={Input}
                    name="projectWarning"
                    placeholder="주의사항을 입력해주세요"
                  />

                  <Label>지원 방법 (이메일, 카카오톡 등)</Label>
                  <Field
                    as={Input}
                    name="applyMethod"
                    placeholder="예: example@gmail.com 또는 오픈채팅 링크"
                  />
                </>
              )}

              {/* 스터디 폼 */}
              {values.boardType === 'STUDY_RECRUIT' && (
                <>
                  <Label>제목</Label>
                  <Field
                    as={Input}
                    type="text"
                    name="title"
                    placeholder="제목을 입력해주세요"
                  />

                  <Label>내용</Label>
                  <Field
                    as={TextArea}
                    name="description"
                    placeholder="내용을 입력해주세요"
                  />
                  <Label>스터디 일정</Label>
                  <div className="flex items-center gap-2">
                    <DateInput
                      readOnly
                      value={`${values.studyStartDate || '시작일'} ~ ${
                        values.studyEndDate || '종료일'
                      }`}
                      onClick={() => setStudyModalOpen(true)}
                    />
                  </div>
                  <DateSelectModal
                    isOpen={studyModalOpen}
                    onClose={() => setStudyModalOpen(false)}
                    startDate={
                      values.studyStartDate
                        ? new Date(values.studyStartDate)
                        : null
                    }
                    endDate={
                      values.studyEndDate ? new Date(values.studyEndDate) : null
                    }
                    onChange={(date, type) => {
                      const formatted = date?.toISOString().split('T')[0];
                      if (type === 'start')
                        setFieldValue('studyStartDate', formatted);
                      else setFieldValue('studyEndDate', formatted);
                    }}
                  />

                  <Label>예상 커리큘럼 간략히</Label>
                  <Field
                    as={Input}
                    name="studyCurriculum"
                    placeholder="스터디 커리큘럼 간략히 작성"
                  />

                  <Label>모집 인원</Label>
                  <Field
                    as={Input}
                    name="recruitCount"
                    type="number"
                    placeholder="숫자로 입력해주세요"
                  />

                  <Label>스터디 관련 주의사항</Label>
                  <Field
                    as={Input}
                    name="studyWarning"
                    placeholder="주의사항을 입력해주세요"
                  />

                  <Label>지원 방법 (이메일, 카카오톡 등)</Label>
                  <Field
                    as={Input}
                    name="applyMethod"
                    placeholder="예: example@gmail.com 또는 오픈채팅 링크"
                  />
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginTop: '0.5rem',
                    }}
                  >
                    참고 사항 : 스터디 게시판에 영리를 목적으로 하는 게시글(유료
                    과외 및 멘토링 등)을 작성한 경우 해당 글은 운영 방침에 의해
                    중단, 삭제될 수 있음을 안내드립니다.
                  </p>
                </>
              )}

              <ButtonRow>
                <CancelButton
                  type="button"
                  onClick={() => navigate('/community')}
                >
                  취소
                </CancelButton>
                <SubmitButton type="submit">
                  <FaRegFileAlt />
                  등록하기
                </SubmitButton>
              </ButtonRow>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default CommunityWrite;
