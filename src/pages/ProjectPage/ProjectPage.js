import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      ProjectPage
      <button primary onClick={() => navigate("/projects/register")}>
        프로젝트 등록
      </button>
    </div>
  );
};

export default ProjectPage;