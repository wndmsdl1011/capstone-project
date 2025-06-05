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
    <div>
      {scrapProjects && scrapProjects.length > 0 ? (
        scrapProjects.map((scrap, index) =>
          scrap.project ? (
            <ProjectCard
              key={scrap.project.projectId}
              project={scrap.project}
            />
          ) : (
            <div key={index}>잘못된 프로젝트 데이터입니다.</div>
          )
        )
      ) : (
        <p>스크랩한 프로젝트가 없습니다.</p>
      )}
    </div>
  );
};

export default ScrappedProjects;
