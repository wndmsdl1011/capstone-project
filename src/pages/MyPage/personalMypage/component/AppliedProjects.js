import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from '../../../../common/component/ProjectCard'
import { GetSupportedProjects } from '../../../../features/post/projectSlice';
import LoadingSpinner from '../../../../components/LoadingSpinner'

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
  const { loading, success, error } = useSelector((state) => state.project);

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
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div style={{
          width: "100%",
          textAlign: "center",
          color: "#f44336",
          fontSize: "18px",
          padding: "40px 0"
        }}>
          프로젝트를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : success ? (
        projects.length > 0 ? (
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
        )
      ) : null}
    </div>
  )
}

export default AppliedProjects
