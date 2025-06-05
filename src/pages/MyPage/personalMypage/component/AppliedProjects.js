import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import ProjectCard from '../../../../common/component/ProjectCard'
import { GetSupportedProjects } from '../../../../features/post/projectSlice';

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const AppliedProjects = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await dispatch(GetSupportedProjects());
        const reversed = [...response.payload].reverse();
        setProjects(reversed);
      } catch (error) {
        console.error("프로젝트 불러오기 실패", error);
      }
    }

    fetchProjects();
  }, [dispatch]);

  const projectRows = chunkArray(projects, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      {projects && projects.length > 0 ? (
        projectRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '20px' }}>
            {row.map((proj, i) => (
              <ProjectCard key={proj.id || i} project={proj} />
            ))}
          </div>
        ))
      ) : (
        <div style={{
          width: "100%",
          textAlign: "center",
          color: "#888",
          fontSize: "18px",
          padding: "40px 0"
        }}>
          지원정보가 없습니다
        </div>
      )}
    </div>
  )
}

export default AppliedProjects
