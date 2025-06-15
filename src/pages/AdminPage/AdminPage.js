import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUsers,
  faFolderOpen,
  faExclamationTriangle,
  faTachometerAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { approveCompany, fetchPendingCompanies } from '../../features/admin/adminSlice';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  padding: 24px 16px;
  border-right: 1px solid #e5e7eb;
`;
const AdminTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #3730a3;
  margin-bottom: 24px;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? '#e0e7ff' : 'transparent')};
  color: ${({ active }) => (active ? '#3730a3' : '#6b7280')};
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #e0e7ff;
    color: #3730a3;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 32px;
`;

const SearchBox = styled.div`
  margin-bottom: 24px;
  position: relative;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CompanyCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CompanyIconBox = styled.div`
  background-color: #e9f0ff; /* 연한 푸른색 */
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CompanyName = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #111827;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background-color: #f3f4f6;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  color: ${({ type }) => (type === '대기' ? '#92400e' : '#0f766e')};
  background-color: ${({ type }) => (type === '대기' ? '#fef3c7' : '#ccfbf1')};
`;

const ActionButton = styled.button`
  margin-right: 8px;
  background-color: ${({ type }) => (type === '승인' ? '#d1fae5' : '#fee2e2')};
  color: ${({ type }) => (type === '승인' ? '#065f46' : '#991b1b')};
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
`;

const data = [
  {
    company: 'CS Korea',
    name: '김현수',
    position: '인사 담당자',
    date: '2024.01.15',
    status: '대기',
  },
  {
    company: 'Tech Solutions',
    name: '이영지',
    position: '채용 매니저',
    date: '2024.01.14',
    status: '대기',
  },
  {
    company: 'Digital Labs',
    name: '박지훈',
    position: '인사 팀장',
    date: '2024.01.13',
    status: '대기',
  },
];

const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState('기업 승인');
  const [search, setSearch] = useState('');
  const {pendingCompanyList} = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchPendingCompanies());
    
  },[dispatch])

  const handleApprove = async(status, companyId) => {
    await dispatch(approveCompany({ status, companyId })).unwrap(); 
    dispatch(fetchPendingCompanies()); 
    
  }

  return (
    <Container>
      <Sidebar>
        <AdminTitle>Admin</AdminTitle>
        <SidebarItem
          active={activeMenu === '기업 승인'}
          onClick={() => setActiveMenu('기업 승인')}
        >
          <FontAwesomeIcon
            icon={faBuilding}
            style={{ marginRight: '4px', marginLeft: '4px' }}
          />{' '}
          기업 승인
        </SidebarItem>
        <SidebarItem
          active={activeMenu === '회원 관리'}
          onClick={() => setActiveMenu('회원 관리')}
        >
          <FontAwesomeIcon icon={faUsers} /> 회원 관리
        </SidebarItem>
        <SidebarItem
          active={activeMenu === '프로젝트 관리'}
          onClick={() => setActiveMenu('프로젝트 관리')}
        >
          <FontAwesomeIcon icon={faFolderOpen} /> 프로젝트 관리
        </SidebarItem>
        <SidebarItem
          active={activeMenu === '신고 관리'}
          onClick={() => setActiveMenu('신고 관리')}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} /> 신고 관리
        </SidebarItem>
        <SidebarItem
          active={activeMenu === '대시보드'}
          onClick={() => setActiveMenu('대시보드')}
        >
          <FontAwesomeIcon icon={faTachometerAlt} /> 대시보드
        </SidebarItem>
      </Sidebar>

      <Content>
        <h2>
          <strong>승인 대기 목록</strong>
        </h2>
        <p>기업 담당자 승인 요청을 관리할 수 있습니다.</p>

        <SearchBox>
          <SearchInput
            type="text"
            placeholder="기업명 또는 담당자명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon icon={faSearch} />
        </SearchBox>

        <Table>
          <thead>
            <tr>
              <Th>기업명</Th>
              <Th>담당자명</Th>
              <Th>직책</Th>
              <Th>신청일</Th>
              <Th>상태</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {pendingCompanyList.map((item, idx) => (
              <tr key={idx}>
                <Td>
                  <CompanyCell>
                    <CompanyIconBox>
                      <FontAwesomeIcon
                        icon={faBuilding}
                        color="#1d4ed8"
                        size="lg"
                      />
                    </CompanyIconBox>
                    <CompanyName>{item.companyName}</CompanyName>
                  </CompanyCell>
                </Td>
                <Td>{item.name}</Td>
                <Td>{item.position}</Td>
                <Td>{item.createdAt}</Td>
                <Td>
                  <Tag type={item.status}> {item.postRole === 'PENDING' ? '대기' : item.postRole === 'APPROVE' ? '승인' : item.postRole}</Tag>
                </Td>
                <Td>
                  <ActionButton type="승인" onClick={() => handleApprove("APPROVED", item.companyId)}>승인</ActionButton>
                  <ActionButton type="거절" onClick={() => handleApprove("REJECTED", item.companyId)}>거절</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default AdminPage;
