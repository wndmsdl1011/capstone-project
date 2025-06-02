import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import ProjectCard from '../../../../common/component/ProjectCard'
import { GetSupportedProjects } from '../../../../features/post/projectSlice';

const AppliedProjects = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await dispatch(GetSupportedProjects());
        setProjects(response.payload);
      } catch (error) {
        console.error("프로젝트 불러오기 실패", error);
      }
    }

    fetchProjects();
  }, [])
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '20px' }}>
      {projects && projects.length > 0 ? (
        projects.map((proj, i) => (
          <ProjectCard key={proj.id || i} project={proj} />
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
