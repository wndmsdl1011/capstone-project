import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectList,
  scrapProject,
  cancelScrapProject,
} from "../../features/post/projectSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForumIcon from "@mui/icons-material/Forum";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import Avatar from "@mui/material/Avatar";
import TechIcon from "../../components/TechIcon";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectList, totalPages, loading } = useSelector(
    (state) => state.project
  );
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role ?? sessionStorage.getItem("userRole") ?? "";
  console.log("👤 현재 사용자 Role:", role);
  const [page, setPage] = useState(1);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

  const toggleBookmark = (project) => {
    const isBookmarked = bookmarkedProjects.includes(project.projectId);
    setBookmarkedProjects((prev) =>
      isBookmarked
        ? prev.filter((pid) => pid !== project.projectId)
        : [...prev, project.projectId]
    );
    if (isBookmarked) {
      dispatch(cancelScrapProject(project.projectId));
    } else {
      dispatch(scrapProject(project.projectId));
    }
  };

  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "마감";
    if (diffDays <= 7) return "임박";
    return "진행중";
  };

  useEffect(() => {
    dispatch(fetchProjectList({ page, size: 10 })).then((res) => {
      console.log("📦 프로젝트 응답 데이터", res);
    });
  }, [page, dispatch]);

  return (
    <Container>
      <Header>
        <Title>프로젝트 공고 목록</Title>
        {role === "COMPANY" && (
          <PostButton onClick={() => navigate("/projects/register")}>
            프로젝트 등록
          </PostButton>
        )}
      </Header>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <CardGrid>
        {projectList.map((project) => (
          <Link
            to={`/projects/${project.projectId}`}
            key={project.projectId}
            style={{ textDecoration: "none" }}
          >
            <Card>
              <BookmarkButton
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(project);
                }}
              >
                {bookmarkedProjects.includes(project.projectId) ? (
                  <BookmarkIcon fontSize="medium" sx={{ color: "#2d3282" }} />
                ) : (
                  <BookmarkBorderIcon
                    fontSize="medium"
                    sx={{ color: "#2d3282" }}
                  />
                )}
              </BookmarkButton>
              <TagRow>
                <Tag>프로젝트</Tag>
                {(() => {
                  const status = getDeadlineStatus(project.recruitDeadline);
                  if (status === "임박") {
                    return (
                      <UrgentTag
                        style={{ background: "#fff3cd", color: "#856404" }}
                      >
                        마감임박
                      </UrgentTag>
                    );
                  }
                  if (status === "마감") {
                    return (
                      <UrgentTag
                        style={{ background: "#f8d7da", color: "#721c24" }}
                      >
                        모집 마감
                      </UrgentTag>
                    );
                  }
                  return (
                    <UrgentTag
                      style={{ background: "#d1ecf1", color: "#0c5460" }}
                    >
                      모집중
                    </UrgentTag>
                  );
                })()}
              </TagRow>
              <MetaItem
                style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                  marginBottom: "4px",
                }}
              >
                마감일: {project.recruitDeadline}
              </MetaItem>
              <ProjectTitle>{project.title}</ProjectTitle>
              <SkillTagRow>
                {(project.requiredSkill || []).map((skill) => (
                  <TechIcon key={skill} tech={skill} size={24} />
                ))}
              </SkillTagRow>
              <MetaRow>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      bgcolor: "#cbd5e1",
                    }}
                  >
                    {project.managername?.charAt(0) || "유"}
                  </Avatar>
                  <MetaItem>{project.managername}</MetaItem>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <MetaItem
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <VisibilityIcon fontSize="small" /> {project.views || 0}
                  </MetaItem>
                  <MetaItem
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ForumIcon fontSize="small" />
                    {project.comments || 0}
                  </MetaItem>
                </div>
              </MetaRow>
            </Card>
          </Link>
        ))}
        </CardGrid>
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
  width: 70%;
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
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 240px;
`;
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 24px;
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
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin: 4px 0;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #6b7280;
`;

const MetaItem = styled.span``;

const SkillTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0;
  margin-bottom: 8px;
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
