import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectList } from "../../features/post/projectSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectList, totalPages, loading } = useSelector(
    (state) => state.project
  );
  const [page, setPage] = useState(1);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

  const toggleBookmark = (id) => {
    setBookmarkedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    dispatch(fetchProjectList({ page, size: 10 }));
  }, [page, dispatch]);

  return (
    <Container>
      <Header>
        <Title>프로젝트 공고 목록</Title>
        <PostButton onClick={() => navigate("/projects/register")}>
          프로젝트 등록
        </PostButton>
      </Header>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        projectList.map((project) => (
          <Link
            to={`/projects/${project.projectId}`}
            key={project.projectId}
            style={{ textDecoration: "none" }}
          >
            <Card>
              <BookmarkButton
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(project.projectId);
                }}
              >
                {bookmarkedProjects.includes(project.projectId) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#2d3282"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 3c-1.1 0-2 .9-2 2v16l9-4 9 4V5c0-1.1-.9-2-2-2H5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#2d3282"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-bookmark"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                )}
              </BookmarkButton>
              <TagRow>
                <Tag>프로젝트</Tag>
                <UrgentTag style={{ background: "#fff4e5", color: "#ff9900" }}>
                  모집중
                </UrgentTag>
              </TagRow>
              <ProjectTitle>{project.title}</ProjectTitle>
              <SkillTagRow>
                {project.requiredSkill.map((skill) => (
                  <SkillTag key={skill}>{skill}</SkillTag>
                ))}
              </SkillTagRow>
              <MetaRow>
                <MetaItem>{project.managername}</MetaItem>
                <MetaItem>{project.createdAt}</MetaItem>
              </MetaRow>
            </Card>
          </Link>
        ))
      )}

      <PaginationWrapper>
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={({ selected }) => setPage(selected + 1)}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"disabled"}
        />
      </PaginationWrapper>
    </Container>
  );
};

export default ProjectPage;

const Container = styled.div`
  width: 1248px;
  margin: 0 auto;
  padding: 32px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const PostButton = styled.button`
  padding: 10px 20px;
  background-color: #2d3282;
  border: none;
  border-radius: 9999px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const Card = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px 20px 60px;
  margin-bottom: 32px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  background: #f3f4f6;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  color: #4b5563;
`;

const UrgentTag = styled(Tag)``;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
`;

const MetaItem = styled.span``;

const SkillTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const SkillTag = styled.span`
  background: #e6eeff;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  color: #2d3282;
`;

const PaginationWrapper = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 32px;
    padding: 10px 16px;
    background-color: #f9fafb;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  }

  .page-item {
    list-style: none;
  }

  .page-link {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #2d3282;
    color: #2d3282;
    background-color: white;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    font-weight: 600;
  }

  .page-link:hover {
    background-color: #2d3282;
    color: white;
  }

  .active .page-link {
    background-color: #2d3282;
    color: white;
    box-shadow: 0 0 0 3px rgba(45, 50, 130, 0.2);
  }

  .disabled .page-link {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f3f4f6;
    color: #9ca3af;
  }
`;
