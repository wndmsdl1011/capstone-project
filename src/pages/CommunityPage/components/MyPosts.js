import React, { useEffect, useState } from 'react';
import CommunityCard from './CommunityCard';
import styled from 'styled-components';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoardMine } from '../../../features/community/communitySlice';


const TopBar = styled.div`
  position: relative;
  padding: 10px 0;
  display: flex;
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
  width: 100%;
  position: relative;

`;

const BackButton = styled.button`
  position: absolute;
  left: 20px; /* 왼쪽에서 20px 여백을 줘서 제목과 겹치지 않도록 조정 */
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: 1.7rem;
  font-weight: bold;
  color: #2D3282;
  
`;

const SearchBox = styled.div`
  position: absolute; /* HeaderRow 내에서 절대 위치로 우측 고정 */
  right: 20px; /* 오른쪽에서 20px 여백을 줘서 끝에 너무 붙지 않도록 */
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 10px;

  input {
    border: none;
    outline: none;
    font-size: 14px;
    margin-right: 6px;
    width: 120px;
  }

  svg {
    color: #6b7280;
    font-size: 16px;
    cursor: pointer;
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%;
  
  box-sizing: border-box;
  margin-top: 10px; 
`;

const TypeSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  background-color: white;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #9ca3af;
  }
`;

const MyPosts = ({ selectedMenu }) => {
  const dispatch = useDispatch();
  const { boardMineList, loading, error } = useSelector((state) => state.community);

  const [selectedBoardType, setSelectedBoardType] = useState('GENERAL');
  const [page, setPage] = useState(1);

  const boardTypes = [
    { label: '일반', value: 'GENERAL' },
    { label: '프로젝트 모집', value: 'PROJECT_RECRUIT' },
    { label: '스터디 모집', value: 'STUDY_RECRUIT' },
  ];

  useEffect(() => {
    dispatch(fetchBoardMine({ boardType: selectedBoardType }));
  }, [dispatch, selectedBoardType]);

  const handleBackClick = () => selectedMenu(null);

  const handleBoardTypeChange = (event) => {
    setSelectedBoardType(event.target.value);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error.message || '알 수 없는 오류'}</div>;
  }

  return (
    <>
      <TopBar>
        <HeaderRow>
          <BackButton onClick={handleBackClick}>
            <FaArrowLeft style={{ marginRight: '6px', marginTop: '2px' }} />
            목록으로 돌아가기
          </BackButton>

          <Title>내가 작성한 글</Title>

        </HeaderRow>
        <FilterRow>
          <TypeSelect onChange={handleBoardTypeChange} value={selectedBoardType}>
            {boardTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </TypeSelect>
          <SearchBox>
            <input type="text" placeholder="검색" />
            <FaSearch />
          </SearchBox>
        </FilterRow>
      </TopBar>
      {boardMineList.length > 0 ? (
        boardMineList.map((item) => (
          <CommunityCard
            key={item.boardId}
            isAuthor={item.mine}
            writer={item.writer}
            title={item.title}
            content={item.description}
            viewCount={item.viewCount}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
            boardType={selectedBoardType}
            boardId={item.boardId}
            tags={item.tags}
            skills={item.skills}
            commentCount={item.commentCount}
            page={page}
          />
        ))
      ) : (
        <div>작성된 게시글이 없습니다.</div>
      )}
    </>
  );
};

export default MyPosts;