import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchScrapProjectList } from "../../../../features/post/projectSlice";
import ProjectCard from "../../../../common/component/ProjectCard";

const ScrappedProjects = () => {
  const dispatch = useDispatch();
  const scrapProjects = useSelector((state) => state.project.scrapProjectList);

  useEffect(() => {
    dispatch(fetchScrapProjectList());
  }, [dispatch]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column-reverse", gap: "20px" }}
    >
      {scrapProjects && scrapProjects.length > 0 ? (
        scrapProjects.map((project) => (
          <ProjectCard
            key={project.projectId}
            project={{
              ...project,
              requiredSkills:
                project.requiredSkills || project.requiredSkill || [],
              views: project.viewCount ?? 0,
              comments: 0,
              managername: "운영자",
              recruitDeadline: project.endDate,
              appliedAt: project.endDate,
            }}
            dateLabel="마감일"
            dateField="recruitDeadline"
          />
        ))
      ) : (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "#888",
            fontSize: "18px",
            padding: "40px 0",
          }}
        >
          스크랩한 프로젝트가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ScrappedProjects;
