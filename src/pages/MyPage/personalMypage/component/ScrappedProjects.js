import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchScrapProjectList } from "../../../../features/post/projectSlice";
import ProjectCard from "../../../../common/component/ProjectCard";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const ScrappedProjects = () => {
  const dispatch = useDispatch();
  const scrapProjects = useSelector((state) => state.project.scrapProjectList);
  const projectRows = chunkArray(scrapProjects || [], 2);

  useEffect(() => {
    dispatch(fetchScrapProjectList());
  }, [dispatch]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column-reverse", gap: "20px" }}
    >
      {scrapProjects && scrapProjects.length > 0 ? (
        projectRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "20px" }}>
            {row.map((project, i) => (
              <ProjectCard
                key={project.projectId || i}
                project={{
                  ...project,
                  requiredSkills: project.skills || [],
                  views: project.viewCount ?? 0,
                  comments: 0,
                  managername: "운영자",
                  recruitDeadline: project.endDate,
                  appliedAt: project.endDate,
                }}
                dateLabel="마감일"
                dateField="recruitDeadline"
              />
            ))}
          </div>
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
