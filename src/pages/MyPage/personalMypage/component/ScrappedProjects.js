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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
  },
  emptyMessage: {
    width: "100%",
    textAlign: "center",
    color: "#888",
    fontSize: "18px",
    padding: "40px 0",
  },
};

const ScrappedProjects = () => {
  const dispatch = useDispatch();
  const scrapProjects =
    useSelector((state) => state.project.scrapProjectList) || [];
  const projectRows = chunkArray(scrapProjects, 2);

  useEffect(() => {
    const fetchScrapProjects = async () => {
      try {
        await dispatch(fetchScrapProjectList());
        const state = await dispatch(fetchScrapProjectList());
        console.log("📦 스크랩 프로젝트 fetch 후 상태 확인:", state.payload);
      } catch (err) {
        console.error(
          "스크랩한 프로젝트 목록을 불러오는 데 실패했습니다.",
          err
        );
      }
    };
    fetchScrapProjects();
  }, [dispatch]);

  console.log("🧩 현재 렌더링 중인 스크랩 프로젝트 목록:", scrapProjects);

  return (
    <div style={styles.container}>
      {scrapProjects.length > 0 ? (
        projectRows.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((project, i) => (
              <ProjectCard
                key={project.projectId || i}
                project={{
                  ...project,
                  requiredSkills:
                    project.requiredSkills || project.skills || [],
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
        <div style={styles.emptyMessage}>스크랩한 프로젝트가 없습니다.</div>
      )}
    </div>
  );
};

export default ScrappedProjects;
