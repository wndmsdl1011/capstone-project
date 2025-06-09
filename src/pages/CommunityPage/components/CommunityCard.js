import React, { useState } from 'react';
import { FiThumbsUp } from 'react-icons/fi';
import { BiMessageDetail, BiCommentDetail } from 'react-icons/bi';
import { AiOutlineEye } from 'react-icons/ai';
import styled from 'styled-components';
import CommentSection from './CommentSection'; // 경로는 프로젝트 구조에 맞게 수정하세요
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import BoardDetailModal from '../Modal/BoardDetailModal';
import { useDispatch } from 'react-redux';
import { DeleteBoard, fetchBoardList } from '../../../features/community/communitySlice';
const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 24px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 130px;
`;

const DropdownItem = styled.div`
  text-align: center;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;

  & > div:first-child {
    font-weight: 600;

    span {
      color: #007bff;
      margin-left: 4px;
      cursor: pointer;
    }
  }

  & > div:last-child {
    font-size: 13px;
    color: #999;
  }
`;

const AuthorTime = styled.div`
  margin-left: auto;
  font-size: 13px;
  color: #aaa;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  background-color: #e0f0ff;
  color: #007bff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  overflow: hidden;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const MoreButton = styled.button`
  background: #e1f6f3;
  color: #1ea7a3;
  padding: 4px 12px;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
`;

const CommentCount = styled.div`
  font-size: 13px;
  color: #555;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #555;
  margin-top: 8px;
`;

const StatGroup = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const categoryOptions = [
  { value: 'INDUSTRY_NEWS', label: '업계소식' },
  { value: 'INTRODUCTION', label: '자기소개' },
  { value: 'DISCUSSION', label: '의견공유' },
  { value: 'QUESTION', label: '질문' },
  { value: 'REVIEW', label: '후기' },
  { value: 'TIPS', label: '팁공유' },
  { value: 'DAILY_LIFE', label: '일상' },
  { value: 'COMMUNICATION', label: '소통' },
  { value: 'EMPATHY', label: '공감' },
  { value: 'RECOMMENDATION', label: '추천' },
  { value: 'INFORMATION', label: '정보' },
];

const MAX_PREVIEW_LENGTH = 150;

const CommunityCard = ({
  writer,
  title,
  content,
  authorLevel = 'UI/UX기획(중수)',
  tags,
  stats = { likes: 2, answers: 2, comments: 2, views: 1991 },
  isAuthor, // 🔥 현재 로그인된 사용자가 이 게시물 작성자인지 여부
  boardId,
  createdAt,
  updatedAt,
  boardType, // GENERAL | PROJECT | STUDY
  skills,
  page,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formattedDate = createdAt?.replace("T", " ");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleShowFull = (e) => {
    e.stopPropagation();
    setShowFull(!showFull);
  };
  const handleCardClick = () => {
    //로그인 해야지말 들갈 수 있게 설정.
    // if (boardType !== 'GENERAL' || (boardType === 'GENERAL' && showFull)) {
    setShowModal(true);
    // }
  };
  const handleBoardEdit = () => {
    setDropdownOpen(false);
    // 실제 처리 함수 호출
    console.log(boardId);
    navigate(`/community/edit/${boardId}`);
  };

  const handleBoardDelete  = () => {
    setDropdownOpen(false);
    const selectedTab = boardType
    dispatch(DeleteBoard({ boardId }))
    .unwrap()
    .then(() => {
      dispatch(fetchBoardList({ page, size: 10, selectedTab }));
    });
    // 만약 2페이지에 데이터가 1개뿐인데 삭제했을 시 페이지가 1로 이동하는 로직
//     .then(() => {
//   const newPage = boardList.length === 1 && page > 1 ? page - 1 : page;
//   dispatch(fetchBoardList({ page: newPage, size: 10, selectedTab }));
// });
  }

  const handleBoardReport  = () => {
    setDropdownOpen(false);
    //신고 처리 로직 추가 예정.
  }
  const lineCount = content?.split('\n').length || 0;
  const shouldShowMore = content.length > MAX_PREVIEW_LENGTH;
  const contentToShow =
    showFull || boardType !== 'GENERAL'
      ? content
      : content.slice(0, MAX_PREVIEW_LENGTH) + '...';
  return (
    <>
      <Card>
        <CardHeader>
          <AuthorSection>
            <Avatar />
            <AuthorInfo>
              <div>
                {writer} <span>· 팔로우</span>
              </div>
              <div>{authorLevel}</div>
            </AuthorInfo>
          </AuthorSection>
          <DropdownWrapper>
            <AuthorTime>{formattedDate}</AuthorTime>
            <MoreVertIcon
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            />
            {dropdownOpen && (
              <DropdownMenu>
                {
                  (isAuthor ? (
                    <>
                      <DropdownItem onClick={() => handleBoardEdit('수정')}>
                        수정
                      </DropdownItem>
                      <DropdownItem onClick={() => handleBoardDelete('삭제')}>
                        삭제
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem
                        onClick={() => handleBoardReport ('게시글 신고')}
                      >
                        게시글 신고
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleBoardReport ('사용자 신고')}
                      >
                        사용자 신고
                      </DropdownItem>
                    </>
                  ))
                }
              </DropdownMenu>
            )}
          </DropdownWrapper>
        </CardHeader>

        {boardType == 'GENERAL' ? (
          <TagList>
            {tags?.map((tag, idx) => {
              const matched = categoryOptions.find(
                (option) => option.value === tag
              );
              const label = matched ? matched.label : tag; // 매칭 안 되면 원래 값 사용
              return <Tag key={idx}># {label}</Tag>;
            })}
          </TagList>
        ) : (
          <TagList>
            {skills?.map((tag, idx) => (
              <Tag key={idx}># {tag}</Tag>
            ))}
          </TagList>
        )}

        <Content onClick={handleCardClick}>
          <h4>
            <strong>{title}</strong>
          </h4>
          {contentToShow}
        </Content>
        <BottomSection>
          {shouldShowMore && boardType === 'GENERAL' && (
            <MoreButton onClick={toggleShowFull}>
              {showFull ? '접기' : '더보기'}
            </MoreButton>
          )}
        </BottomSection>

        <StatsSection>
          <StatGroup>
            <StatItem>
              <FiThumbsUp /> 좋아요 {stats.likes}
            </StatItem>
            <StatItem>
              <BiMessageDetail /> 답변 {stats.answers}
            </StatItem>
            <StatItem>
              <BiCommentDetail /> 댓글 {stats.comments}
            </StatItem>
          </StatGroup>
          <StatItem>
            <AiOutlineEye /> {stats.views.toLocaleString()}
          </StatItem>
        </StatsSection>
        <hr />
        <CommentSection />
      </Card>
      {showModal && (
        <BoardDetailModal
          boardId={boardId}
          onClose={() => setShowModal(false)}
          page={page}
          selectedTab={boardType}
        />
      )}
    </>
  );
};

export default CommunityCard;
