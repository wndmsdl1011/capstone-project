import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FiPenTool } from 'react-icons/fi';
import CommentSection from './components/CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import CommunityCard from './components/CommunityCard';
import { MdOutlineArticle } from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import MyPosts from './components/MyPosts';
import LikedPosts from './components/LikedPosts';
import { fetchBoardList } from '../../features/community/communitySlice';
import ScrollToTopButton from '../../common/ScrollToTopButton';
import { PiTag, PiStackBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { FaHashtag } from "react-icons/fa";
const Container = styled.div`
  display: grid;
  grid-template-columns: 270px 1fr 270px;
  gap: 20px;
  padding: 20px 140px 0px 140px;
  background-color: #f8f9fb;
`;

const Sidebar = styled.div`
  position: sticky;
  top: 20px;
  align-self: start;
  background: none;
  display: flex;
  flex-direction: column;
  gap: 20px;

  max-height: calc(90vh - 40px); /* 화면 높이에서 top margin 고려 */
  overflow-y: auto; /* 스크롤 생성 */
  padding-right: 4px;

  scrollbar-width: none;       
  -ms-overflow-style: none;     
  &::-webkit-scrollbar {
    display: none;              
  }
`;

const Box = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const LoginBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 9px;
`;

const AvatarIcon = styled(AccountCircleIcon)`
  font-size: 48px !important;
  color: #2d3282;
`;

const ProfileTextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const SubText = styled.div`
  color: #9ca3af;
  font-size: 14px;
`;

const LoginButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: bold;

  &:hover {
    background-color: #f0f0f0;
  }
`;
const MenuBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ active }) => (active ? '#1f2937' : '#9ca3af')};
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  svg {
    font-size: 22px;
    margin-bottom: 4px;
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }
`;
const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  border-top: 1px solid;
  width: 100%;
`;

const WriteButton = styled.button`
  background: #1f2937;
  color: white;
  border: none;
  width: 100%;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #2e3a50;
  }
`;

const TagBox = styled(Box)`
  font-size: 14px;

  .title-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 8px;
  }

  .icon-box {
    // background-color: #e0efff;
    padding: 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;

    svg {
      color: #1d4ed8;
      font-size: 20px;
    }
  }

  .title-text {
    font-weight: 600;
    color: #1f2937;
    font-size: 16px;
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 12px;

    svg {
      position: absolute;
      left: 12px;
      color: #6b7280;
      font-size: 16px;
    }
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    margin: 19px 9px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TagSearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px; /* 왼쪽 padding은 돋보기 아이콘 위치 때문 */
  margin: 8px 0 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #1f2937; /* dark gray */
    background-color: #ffffff;
  }
`;

const TagButton = styled.li.attrs((props) => ({
  selected: props.selected,
}))`
  display: block;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? '#1f2937' : '#f8f9fa')};
  color: ${({ selected }) => (selected ? '#FFFFFF' : '#4b5563')};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#111827' : '#1f2937')};
    color: #FFFFFF;
  }
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SearchAndSortBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 20px;
  background: white;
  border-radius: 12px;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 8px 12px;

  svg {
    color: #6b7280;
    font-size: 18px;
    margin-right: 8px;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 14px;
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #f8fafc;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;

  &:hover {
    background-color: #e2e8f0;
  }

  option {
    font-size: 14px;
  }
`;

const RightSection = styled.div`
  position: sticky;
  top: 20px;
  align-self: start;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AdBox = styled.div`
  background: #1f2937;
  color: white;
  padding: 24px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  position: relative;
`;

const AdBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #11151d;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 6px;
`;

const AdTitle = styled.div`
  font-size: 14px;
  color: #cbd5e1;
  margin-bottom: 12px;
`;

const AdMainText = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const AdButton = styled.button`
  width: 100%;
  background: white;
  color: #0d1117;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const HotList = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  ul {
    list-style: none;
    padding-left: 0;
    margin-left:17px;
}
`;

const TabMenu = styled.div`
  display: flex;
  gap: 24px;
  padding: 12px 0;
  background: white;
  border-radius: 12px;
  padding-left: 20px;
`;

const TabItem = styled.div`
  padding: 8px 4px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: ${({ active }) =>
    active ? '2px solid #0d1117' : '2px solid transparent'};
  color: ${({ active }) => (active ? '#0d1117' : '#666')};
  transition: all 0.2s;
  &:hover {
    color: black;
    border-bottom: 2px solid #0d1117;
  }
`;
const LoadMoreButton = styled.button`
  width: 100%;
  padding: 10px 0;
  background-color: #2d2f36;  
  color: #ffffff;             
  border: none;
  border-radius: 999px;      
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #3a3c44;  
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
const techSkills = [
  'HTML', 'CSS', 'JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'VUE', 'ANGULAR', 'NEXTJS',
  'TAILWIND', 'BOOTSTRAP', 'JAVA', 'SPRING', 'SPRING_BOOT', 'PYTHON', 'DJANGO', 'FLASK',
  'NODEJS', 'EXPRESS', 'MYSQL', 'POSTGRESQL', 'MONGODB', 'ORACLE', 'REDIS', 'SQLITE',
  'DOCKER', 'KUBERNETES', 'AWS', 'AZURE', 'NGINX', 'JENKINS', 'GIT', 'GITHUB_ACTIONS',
  'FLUTTER', 'REACT_NATIVE', 'SWIFT', 'KOTLIN', 'FIGMA', 'POSTMAN', 'JIRA', 'SLACK',
  'NOTION', 'INTELLIJ', 'VS_CODE'
];

const generalTags = [
  '업계소식', '자기소개', '의견공유', '질문', '후기', '팁공유', '일상', '소통', '공감', '추천', '정보'
];

const tagMap = {
  '업계소식': 'INDUSTRY_NEWS',
  '자기소개': 'INTRODUCTION',
  '의견공유': 'DISCUSSION',
  '질문': 'QUESTION',
  '후기': 'REVIEW',
  '팁공유': 'TIPS',
  '일상': 'DAILY_LIFE',
  '소통': 'COMMUNICATION',
  '공감': 'EMPATHY',
  '추천': 'RECOMMENDATION',
  '정보': 'INFORMATION',
};

const CommunityPage = () => {
  const { profile } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState('GENERAL');
  const [selectedMenu, setSelectedMenu] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOption, setSortOption] = useState('최신순');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardList, page, totalPages, loading } = useSelector(
    (state) => state.community
  );
  // 페이지가 바뀌면 데이터 fetching 을 하자
  
  const tabs = [
    { label: '일반', value: 'GENERAL' },
    { label: '프로젝트 모집', value: 'PROJECT_RECRUIT' },
    { label: '스터디 모집', value: 'STUDY_RECRUIT' },
  ];
  // 처음 페이지 로딩
  useEffect(() => {
    dispatch(fetchBoardList({ page: 1, size: 10, selectedTab }));
    setSelectedTags([]);
    setSearchTerm('');
  }, [dispatch, selectedTab]);

  // 더보기 버튼 클릭 시 다음 페이지 불러오기
  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      dispatch(fetchBoardList({ page: page + 1, size: 10, selectedTab }));
    }
  };

  // 접기 버튼 클릭 시 초기화 (page 1로만 불러오기)
  // const handleReset = () => {
  //   dispatch(fetchBoardList({ page: 1, size: 10 }));
  // };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleWriteClick = () => {
    if (!profile) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/community/write');
    }
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    
  };
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredTags =
    selectedTab === 'GENERAL'
      ? generalTags
      : techSkills.filter((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // 게시글 필터링 Logic
const filteredBoards = boardList.filter((item) => {
  const targetField = selectedTab === 'GENERAL' ? item.tags : item.skills;

  // GENERAL 태그일 경우 =>  selectedTags(한글)를 영어로 매핑해서 비교
  if (selectedTab === 'GENERAL') {
    const selectedEnglishTags = selectedTags.map((tag) => tagMap[tag]);
    return (
      selectedTags.length === 0 ||
      selectedEnglishTags.every((tag) => targetField.includes(tag))
    );
  }

  // TECH 태그일 경우는 그대로 한글 기술 이름 비교 ㄱ
  return (
    selectedTags.length === 0 ||
    selectedTags.every((tag) => targetField.includes(tag))
  );
});

  return (
    <Container>
      <Sidebar>
        <LoginBox>
          {profile ? (
            <ProfileBox>
              <AvatarIcon />
              <ProfileTextBox>
                <Nickname>{profile.name}</Nickname>
                <SubText>웹 프론트엔드</SubText>
              </ProfileTextBox>
            </ProfileBox>
          ) : (
            <LoginButton onClick={handleLoginClick}>
              <AccountCircleIcon style={{ fontSize: '50', color: 'gray' }} />
              로그인 해주세요.
            </LoginButton>
          )}

          <MenuBox>
            <MenuItem
              active={selectedMenu === '내글'}
              onClick={() => setSelectedMenu('내글')}
            >
              <MdOutlineArticle />
              <span>내글</span>
            </MenuItem>
            <MenuItem
              active={selectedMenu === '좋아요'}
              onClick={() => setSelectedMenu('좋아요')}
            >
              <AiOutlineHeart />
              <span>좋아요</span>
            </MenuItem>
            <MenuItem
              active={selectedMenu === '마이페이지'}
              onClick={() => setSelectedMenu('마이페이지')}
            >
              <CgProfile />
              <span>마이페이지</span>
            </MenuItem>
          </MenuBox>
          <Divider />
          <WriteButton onClick={handleWriteClick}>
            <FiPenTool /> 글쓰기
          </WriteButton>
        </LoginBox>

        <TagBox>
           <div className="title-row">
    <div className="icon-box">
      {selectedTab === 'GENERAL' ? <FaHashtag /> : <PiStackBold />}
    </div>
    <div className="title-text">
      {selectedTab === 'GENERAL' ? '태그' : '기술 스택 선택'}
    </div>
  </div>

  {selectedTab !== 'GENERAL' && (
    <div className="search-wrapper">
      <FiSearch />
      <TagSearchInput
        type="text"
        placeholder="기술스택 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )}
          <ul>
            {filteredTags.map((tag) => (
              <TagButton
                key={tag}
                onClick={() => toggleTag(tag)}
                selected={selectedTags.includes(tag)}
              >
                #{tag}
              </TagButton>
            ))}
          </ul>
        </TagBox>
      </Sidebar>

      {!selectedMenu && (
        <Feed>
          <TabMenu>
            {tabs.map((tab) => (
              <TabItem
                key={tab.value}
                active={selectedTab === tab.value}
                onClick={() => setSelectedTab(tab.value)}
              >
                {tab.label}
              </TabItem>
            ))}
            
          </TabMenu>
           <SearchAndSortBox>
      <SearchBarWrapper>
        <FiSearch />
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </SearchBarWrapper>

      <SortSelect value={sortOption} onChange={handleSortChange}>
        <option value="최신순">최신순</option>
        <option value="인기순">인기순</option>
        <option value="댓글 많은순">댓글 많은순</option>
      </SortSelect>
    </SearchAndSortBox>

          {filteredBoards
            
            .map((item) => (
              <CommunityCard
                key={item.boardId}
                isAuthor={item.mine} // 예시로 boardId가 1이면 작성자로 가정
                writer={item.writer}
                title={item.title}
                content={item.description}
                viewCount={item.viewCount}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
                boardType={selectedTab}
                boardId={item.boardId}
                tags={item.tags}
                skills={item.skills}
                commentCount={item.commentCount}
                page={page}
              />
            ))}

          {page < totalPages && (
            <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
              더보기
            </LoadMoreButton>
          )}

          {/* 접기 */}
          {/* {page >= totalPages && page > 1 && (
        <button onClick={handleReset} disabled={loading}>
          접기
        </button>
      )} */}
          <ScrollToTopButton />
        </Feed>
      )}
      {selectedMenu && (
        <Feed>
          {selectedMenu === '내글' && (
            <MyPosts selectedMenu={setSelectedMenu} />
          )}
          {selectedMenu === '좋아요' && (
            <LikedPosts selectedMenu={setSelectedMenu} />
          )}
          {selectedMenu === '마이페이지' && navigate('/mypage/user')}
        </Feed>
      )}

      <RightSection>
        <AdBox>
          <AdBadge>AD</AdBadge>
          <AdTitle>풀스택개발 스킬로</AdTitle>
          <AdMainText>
            내 아이디어 실현할
            <br />
            사람 찾습니다
          </AdMainText>
          <AdButton>포스트 무료업로드 입주하기 →</AdButton>
        </AdBox>
        <HotList>
          <h4>🔥 HOT 출시</h4>
          <ul>
            <li>1️⃣ JMP</li>
            <li>2️⃣ 백석 지음</li>
            <li>3️⃣ 커리어리</li>
            <li>4️⃣ 챗봇</li>
          </ul>
        </HotList>
      </RightSection>
    </Container>
  );
};

export default CommunityPage;
