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

const LikedPosts = ({ selectedMenu }) => {
  const navigate = useNavigate();

  const likedPosts = [
    { id: 101, content: '좋아요 누른 글입니다.' },
    { id: 102, content: '이 글도 좋아요!' },
  ];

  const handleBackClick = () => selectedMenu(null);

  return (
    <>
      <TopBar>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft style={{ marginRight: '6px', marginTop: '2px' }} />
          목록으로 돌아가기
        </BackButton>

        <Title>나의 관심 목록</Title>

        <SearchBox>
          <input type="text" placeholder="검색" />
          <FaSearch />
        </SearchBox>
      </TopBar>

      {likedPosts.map((post) => (
        <CommunityCard key={post.id} content={post.content} />
      ))}
    </>
  );
};

export default LikedPosts;
