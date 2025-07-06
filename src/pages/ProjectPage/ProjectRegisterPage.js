import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postProject } from "../../features/post/projectSlice";
import styled from "styled-components";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
import { showToastMessage } from "../../features/common/uiSlice";
import Select from "react-select";

const TECH_STACK_OPTIONS = [
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "JAVA", label: "Java" },
  { value: "PYTHON", label: "Python" },
  { value: "REACT", label: "React" },
  { value: "VUE", label: "Vue" },
  { value: "ANGULAR", label: "Angular" },
  { value: "NEXTJS", label: "Next.js" },
  { value: "TYPESCRIPT", label: "TypeScript" },
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "NODEJS", label: "Node.js" },
  { value: "EXPRESS", label: "Express" },
  { value: "SPRING", label: "Spring" },
  { value: "SPRING_BOOT", label: "Spring Boot" },
  { value: "DJANGO", label: "Django" },
  { value: "FLASK", label: "Flask" },
  { value: "MYSQL", label: "MySQL" },
  { value: "POSTGRESQL", label: "PostgreSQL" },
  { value: "MONGODB", label: "MongoDB" },
  { value: "AWS", label: "AWS" },
  { value: "KUBERNETES", label: "Kubernetes" },
  { value: "DOCKER", label: "Docker" },
  { value: "GIT", label: "Git" },
  { value: "FIGMA", label: "Figma" },
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
      title,
      description,
      stack,
      startDate,
      endDate,
      recruitCount,
      recruitDeadline,
    } = form;

    if (!title || title.trim() === "")
      return dispatch(
        showToastMessage({ message: "제목을 입력해주세요!", status: "error" })
      );
    if (!description || description.trim() === "")
      return dispatch(
        showToastMessage({ message: "내용을 입력해주세요!", status: "error" })
      );
    if (!stack || stack.length === 0)
      return dispatch(
        showToastMessage({
          message: "기술 스택을 선택해주세요!",
          status: "error",
        })
      );
    if (!startDate)
      return dispatch(
        showToastMessage({ message: "시작일을 선택해주세요!", status: "error" })
      );
    if (!endDate)
      return dispatch(
        showToastMessage({ message: "종료일을 선택해주세요!", status: "error" })
      );
    if (!recruitCount)
      return dispatch(
        showToastMessage({
          message: "모집 인원을 선택해주세요!",
          status: "error",
        })
      );
    if (!recruitDeadline)
      return dispatch(
        showToastMessage({
          message: "모집 마감일을 선택해주세요!",
          status: "error",
        })
      );

    const postData = {
      title,
      description,
      requiredSkill: stack,
      startDate,
      endDate,
      recruitCount,
      recruitDeadline,
    };

    dispatch(postProject(postData)).then((resultAction) => {
      // Removed error toast dispatch for duplicate handling
      // if (postProject.rejected.match(resultAction)) {
      //   dispatch(
      //     showToastMessage({
      //       message:
      //         resultAction.payload?.message ||
      //         "프로젝트 등록 중 문제가 발생했습니다. (권한 또는 서버 오류)",
      //       status: "error",
      //     })
      //   );
      // } else {
      //   // dispatch(
      //   //   showToastMessage({
      //   //     message: "성공적으로 등록되었습니다.",
      //   //     status: "success",
      //   //   })
      //   // );
      //   navigate("/projects");
      // }
      navigate("/projects");
    });
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
          <Label>모집 인원</Label>
          <Input
            as="select"
            name="recruitCount"
            value={form.recruitCount || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              인원 미정~10명 이상
            </option>
            <option value="1">1명</option>
            <option value="2">2명</option>
            <option value="3">3명</option>
            <option value="4">4명</option>
            <option value="5">5명</option>
            <option value="6">6명</option>
            <option value="7">7명</option>
            <option value="8">8명</option>
            <option value="9">9명</option>
            <option value="10">10명 이상</option>
          </Input>
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
          <Label>시작일</Label>
          <Input type="date" name="startDate" onChange={handleChange} />
        </div>
        <div>
          <Label>종료일</Label>
          <Input type="date" name="endDate" onChange={handleChange} />
        </div>
        <div>
          <Label>모집 마감일</Label>
          <Input type="date" name="recruitDeadline" onChange={handleChange} />
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
    </Container>
  );
};

export default ProjectRegisterPage;
