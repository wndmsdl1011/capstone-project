import React from 'react';
import CommunityCard from './CommunityCard';
import styled from 'styled-components';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TopBar = styled.div`
  position: relative;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
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
  color:#2D3282;
`;

const SearchBox = styled.div`
  position: absolute;
  right: 0;
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
const MyPosts = ({ selectedMenu }) => {
  // 예시 데이터
  const myPosts = [
    {
      id: 1,
      content: '내가 작성한 글입니다.',
    },
    {
      id: 2,
      content: '또 다른 내 글입니다.',
    },
  ];
  const handleBackClick = () => selectedMenu(null);
  return (
    <>
      <TopBar>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft style={{ marginRight: '6px', marginTop: '2px' }} />
          목록으로 돌아가기
        </BackButton>

        <Title>내가 작성한 글</Title>

        <SearchBox>
          <input type="text" placeholder="검색" />
          <FaSearch />
        </SearchBox>
      </TopBar>
      {myPosts.map((post) => (
        <CommunityCard key={post.id} isAuthor={true} content={post.content} />
      ))}
    </>
  );
};

export default MyPosts;
