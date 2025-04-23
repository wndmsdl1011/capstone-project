import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postProject } from "../../features/post/projectSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Select from "react-select";

const TECH_STACK_OPTIONS = [
  { value: "React", label: "React" },
  { value: "Vue", label: "Vue" },
  { value: "Angular", label: "Angular" },
  { value: "Next.js", label: "Next.js" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "Node.js", label: "Node.js" },
  { value: "Express", label: "Express" },
  { value: "Spring", label: "Spring" },
  { value: "Spring Boot", label: "Spring Boot" },
  { value: "Django", label: "Django" },
  { value: "Flask", label: "Flask" },
  { value: "Laravel", label: "Laravel" },
  { value: "MySQL", label: "MySQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Firebase", label: "Firebase" },
  { value: "AWS", label: "AWS" },
  { value: "GCP", label: "GCP" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "Docker", label: "Docker" },
  { value: "Git", label: "Git" },
  { value: "Figma", label: "Figma" },
  { value: "Zeplin", label: "Zeplin" },
];

const POSITION_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
  { value: "designer", label: "디자이너" },
  { value: "ios", label: "IOS" },
  { value: "android", label: "안드로이드" },
  { value: "devops", label: "데브옵스" },
  { value: "pm", label: "PM" },
  { value: "planner", label: "기획자" },
  { value: "marketer", label: "마케터" },
  { value: "qa", label: "QA" },
  { value: "data_analyst", label: "데이터 분석가" },
];

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #ffffff;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;

  &::before {
    content: attr(data-step);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #2d3282;
    color: #fff;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const SelectStyled = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#000" : "#e5e7eb")};
  color: ${(props) => (props.primary ? "#fff" : "#374151")};
`;

const ProjectRegisterPage = () => {
  const [form, setForm] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, data } = useSelector((state) => state.project);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOptions, fieldName) => {
    setForm({
      ...form,
      [fieldName]: selectedOptions.map((option) => option.value),
    });
  };

  const getValueFromArray = (values) =>
    values?.map((val) => ({ label: val, value: val })) || [];

  const handleSubmit = () => {
    const {
      category,
      people,
      method,
      duration,
      stack,
      deadline,
      position,
      contact,
      title,
      description,
      startDate,
      endDate,
    } = form;

    // 필수 항목 누락 시 toast 알림 표시
    if (!category) return toast.error("모집 구분을 선택해주세요!");
    if (!people) return toast.error("모집 인원을 선택해주세요!");
    if (!method) return toast.error("진행 방식을 선택해주세요!");
    if (!duration) return toast.error("진행 기간을 선택해주세요!");
    if (!stack || stack.length === 0)
      return toast.error("기술 스택을 선택해주세요!");
    if (!deadline) return toast.error("모집 마감일을 선택해주세요!");
    if (!position || position.length === 0)
      return toast.error("모집 포지션을 선택해주세요!");
    if (!contact) return toast.error("연락 방법을 선택해주세요!");
    if (!title || title.trim() === "")
      return toast.error("제목을 입력해주세요!");
    if (!description || description.trim() === "")
      return toast.error("내용을 입력해주세요!");
    if (!startDate) return toast.error("시작일을 선택해주세요!");
    if (!endDate) return toast.error("종료일을 선택해주세요!");

    const postData = {
      title,
      description,
      requiredSkill: stack,
      startDate,
      endDate,
    };

    dispatch(postProject(postData));
    console.log("전송할 데이터:", postData); // 나중에 제거 가능
  };

  useEffect(() => {
    if (success && data?.projectId) {
      navigate(`/projects/${data.projectId}`);
    }
  }, [success, data, navigate]);

  return (
    <Container>
      <SectionTitle data-step="1">
        프로젝트 기본 정보를 입력해주세요.
      </SectionTitle>
      <FormGrid>
        <div>
          <Label>모집 구분</Label>
          <SelectStyled
            name="category"
            value={form.category || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              스터디/프로젝트
            </option>
            <option value="study">스터디</option>
            <option value="project">프로젝트</option>
          </SelectStyled>
        </div>
        <div>
          <Label>모집 인원</Label>
          <SelectStyled
            name="people"
            value={form.people || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              인원 미정~10명 이상
            </option>
            <option value="undecided">인원 미정</option>
            <option value="1-5">1~5명</option>
            <option value="6-10">6~10명</option>
            <option value="10+">10명 이상</option>
          </SelectStyled>
        </div>
        <div>
          <Label>진행 방식</Label>
          <SelectStyled
            name="method"
            value={form.method || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              온라인/오프라인
            </option>
            <option value="online">온라인</option>
            <option value="offline">오프라인</option>
            <option value="hybrid">온라인/오프라인</option>
          </SelectStyled>
        </div>
        <div>
          <Label>진행 기간</Label>
          <SelectStyled
            name="duration"
            value={form.duration || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              기간 미정~6개월 이상
            </option>
            <option value="1-month">1개월</option>
            <option value="3-months">3개월</option>
            <option value="6-months-plus">6개월 이상</option>
          </SelectStyled>
        </div>
        <div>
          <Label>기술 스택</Label>
          <Select
            isMulti
            options={TECH_STACK_OPTIONS}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(options) => handleSelectChange(options, "stack")}
            value={getValueFromArray(form.stack)}
            placeholder="프로젝트 사용 스택"
          />
        </div>
        <div>
          <Label>모집 마감일</Label>
          <Input type="date" name="deadline" onChange={handleChange} />
        </div>
        <div>
          <Label>시작일</Label>
          <Input type="date" name="startDate" onChange={handleChange} />
        </div>
        <div>
          <Label>종료일</Label>
          <Input type="date" name="endDate" onChange={handleChange} />
        </div>
        <div>
          <Label>모집 포지션</Label>
          <Select
            isMulti
            options={POSITION_OPTIONS}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(options) => handleSelectChange(options, "position")}
            value={getValueFromArray(form.position)}
            placeholder="프론트엔드, 백엔드..."
          />
        </div>
        <div>
          <Label>연락 방법</Label>
          <SelectStyled
            name="contact"
            value={form.contact || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              카카오톡/이메일
            </option>
            <option value="open_kakao">오픈톡</option>
            <option value="email">이메일</option>
            <option value="google_form">구글 폼</option>
          </SelectStyled>
          <Input
            name="kakao-link"
            placeholder="오픈 카톡방 링크"
            onChange={handleChange}
          />
        </div>
      </FormGrid>

      <SectionTitle data-step="2">프로젝트에 대해 소개해주세요.</SectionTitle>
      <div style={{ marginBottom: "40px" }}>
        <Label>제목</Label>
        <Input
          name="title"
          placeholder="글 제목을 입력해주세요"
          onChange={handleChange}
        />
        <Label style={{ marginTop: "20px" }}>내용</Label>
        <TextArea
          name="description"
          placeholder="내용을 입력해주세요"
          onChange={handleChange}
        />
      </div>

      <ButtonGroup>
        <Button>취소</Button>
        <Button primary onClick={handleSubmit}>
          등록하기
        </Button>
      </ButtonGroup>
      {/* Toast 알림 표시용 컴포넌트 */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        limit={3} //너무 많은 toast가 생성되면 충돌함.
      />
    </Container>
  );
};

export default ProjectRegisterPage;
