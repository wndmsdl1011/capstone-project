import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { DeleteBoard, fetchBoardDetail, fetchBoardList } from '../../../features/community/communitySlice';
import {
  FiUser,
  FiEye,
  FiThumbsUp,
  FiMessageCircle,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';
import { FiUsers, FiClock, FiAlertTriangle, FiMail } from 'react-icons/fi';
import { FiAlertCircle, FiSend,FiCalendar } from 'react-icons/fi';
import { PiStack,PiSirenBold } from "react-icons/pi";
import CommentSection from '../components/CommentSection';
import { useNavigate } from 'react-router-dom';

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 12px;

    max-width: 880px;
    margin: auto;
  }
  .modal-dialog {
    max-width: 800px;
  }
`;

const StyledModalHeader = styled(Modal.Header)`
  background-color: #2d3282;
  color: white;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  .btn-close {
    filter: brightness(0) invert(1); // 흰색으로
  }

  .modal-title {
    color: white;
  }
`;

const Tag = styled.span`
  display: inline-block;
  background-color: #e0f0ff;
  color: #007bff;
  font-weight: 600;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 16px;
  margin-bottom: 12px;
  margin-right:5px;
`;

const Header = styled.div`
  widht:100%;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 16px;
`;

const CreatedAtWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CreatedAt = styled.span`

  color: #888888; 
  font-size: 0.875rem;
  margin-left: auto;
`;

const Title = styled.h3`
  font-size: 27px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;

  .left {
    display: flex;
    align-items: center;
    gap: 10px;

    .item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #6c757d;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-with-tooltip {
      position: relative;
      display: inline-block;

      svg {
        color: #6c757d;
        cursor: pointer;
        font-size: 18px;

        &.edit-icon:hover {
          color: #2d3282;
        }

        &.delete-icon:hover {
          color: red;
        }

        &.report-icon:hover {
          color: red;
        }
      }

      .tooltip {
        visibility: hidden;
        background-color: #333;
        color: #fff;
        font-size: 12px;
        text-align: center;
        border-radius: 4px;
        padding: 4px 6px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
  }
`;


const Content = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const PlainText = styled.p`
  color: #444;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 24px 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1 1 300px;
`;

const InfoLabel = styled.div`
  font-weight: bold;
  color: #222;
  margin-bottom: 4px;
`;

const InfoText = styled.div`
  color: #666;
`;

const WarningBox = styled.div`
  background: #fff3f3;
  border-left: 5px solid #ff6b6b;
  padding: 16px;
  margin-bottom: 24px;
  color: #b00020;
`;

const ApplyBox = styled.div`
  background: #f0f8ff;
  border-left: 5px solid #00bfff;
  padding: 16px;
  color: #0077cc;
`;

const Stats = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  color: #555;
  font-size: 14px;

  .stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
const tagTranslations = {
  INDUSTRY_NEWS: "업계소식",
  INTRODUCTION: "자기소개",
  DISCUSSION: "의견공유",
  QUESTION: "질문",
  REVIEW: "후기",
  TIPS: "팁공유",
  DAILY_LIFE: "일상",
  COMMUNICATION: "소통",
  EMPATHY: "공감",
  RECOMMENDATION: "추천",
  INFORMATION: "정보",
};
const BoardDetailModal = ({ boardId, onClose, page, selectedTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { boardDetailList } = useSelector((state) => state.community);
  // const isMyPost = boardId === postWriterId;
  // const isMyPost = true;
  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardDetail({ boardId }));
    }
  }, [boardId, dispatch]);

  if (!boardDetailList) return null;

  const {
    boardType,
    title,
    description,
    writer,
    createdAt,
    stats,
    viewCount,
    projectEndDate,
    projectStartDate,
    projectWarning,
    recruitCount,
    tags,
    requiredSkills,
    applyMethod,
    studyCurriculum,
    studyEndDate,
    studyStartDate,
    studyWarning,
    mine
  } = boardDetailList;

  const formattedDate = createdAt?.replace("T", " ");
  const onEdit = () => {
    navigate(`/community/edit/${boardId}`);
  };

  const onDelete = () => {
    dispatch(DeleteBoard({ boardId }))
        .unwrap()
        .then(() => {
          dispatch(fetchBoardList({ page, size: 10, selectedTab }));
        });
  };

  const onReport = () => {
    console.log('🚨 신고 버튼 클릭됨');
  };
  return (
    <StyledModal show onHide={onClose} centered>
      <StyledModalHeader closeButton>
        <Modal.Title>게시글 상세</Modal.Title>
      </StyledModalHeader>
      <Modal.Body>
        <Header>
          
          <CreatedAtWrapper>
            {boardType == "GENERAL" ? (
            tags?.map((item, idx)=>{
            return <Tag key={idx}>{tagTranslations[item] || item}</Tag>
            })
          ) : requiredSkills?.map((item, idx)=>{
            return <Tag key={idx}>{item}</Tag>
            })}

            <CreatedAt>{formattedDate}</CreatedAt>
            </CreatedAtWrapper>
          
          <Title>{title}</Title>
          <Meta>
            <div className="left">
              <div className="item">
                <FiUser />
                <span>{writer || '표선영'}</span>
              </div>

              <span>|</span>
              <div className="item">
                <FiEye />
                <span>{viewCount ?? 0}</span>
              </div>
            </div>
            <div className="right">
  {mine ? (
    <>
      <div className="icon-with-tooltip">
        <FiEdit2 className="edit-icon" onClick={onEdit} />
        <span className="tooltip">수정</span>
      </div>
      <div className="icon-with-tooltip">
        <FiTrash2 className="delete-icon" onClick={onDelete} />
        <span className="tooltip">삭제</span>
      </div>
    </>
  ) : (
    <div className="icon-with-tooltip">
      <PiSirenBold className="report-icon" onClick={onReport} />
      <span className="tooltip">신고하기</span>
    </div>
  )}
</div>
          </Meta>
        </Header>
        <Content>
          {boardType === 'GENERAL' && (
            <>
              <SectionTitle>내용</SectionTitle>
              <PlainText>{description}</PlainText>
            </>
          )}

          {boardType === 'PROJECT_RECRUIT' && (
            <>
              <SectionTitle>프로젝트 소개</SectionTitle>
              <PlainText>{description}</PlainText>

              <InfoRow>
                <InfoItem>
                  <FiCalendar size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>프로젝트 기간</InfoLabel>
                    <InfoText>
                      {projectStartDate} ~ {projectEndDate}
                    </InfoText>
                  </div>
                </InfoItem>

                <InfoItem>
                  <FiUsers size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>모집 인원</InfoLabel>
                    <InfoText>{recruitCount}명</InfoText>
                  </div>
                </InfoItem>

                <InfoItem>
                  <PiStack size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>필요 기술 스택</InfoLabel>
                    {requiredSkills?.map((item, idx)=>{
            return <span key={idx}>{item}, </span>
            })}
                  </div>
                </InfoItem>
              </InfoRow>

              <SectionTitle>
                <FiAlertCircle size={20} color="red" style={{marginBottom:"2px"}}/> 프로젝트 주의사항
              </SectionTitle>
              <WarningBox>{projectWarning}</WarningBox>

              <SectionTitle>
                <FiSend color="#0077cc"/> 프로젝트 지원 방법
              </SectionTitle>
              <ApplyBox>{applyMethod}</ApplyBox>
            </>
          )}

          {boardType === 'STUDY_RECRUIT' && (
            <>
              <SectionTitle>스터디 소개</SectionTitle>
              <PlainText>{description}</PlainText>

              <InfoRow>
                <InfoItem>
                  <FiCalendar size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>스터디 기간</InfoLabel>
                    <InfoText>
                      {studyStartDate} ~ {studyEndDate}
                    </InfoText>
                  </div>
                </InfoItem>

                <InfoItem>
                  <FiUsers size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>모집 인원</InfoLabel>
                    <InfoText>{recruitCount}명</InfoText>
                  </div>
                </InfoItem>

                <InfoItem>
                  <FiClock size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>예상 스터디 커리큘럼</InfoLabel>
                    <InfoText>{studyCurriculum}</InfoText>
                  </div>
                </InfoItem>
                <InfoItem>
                  <PiStack size={24} color="#2DE3DF"/>
                  <div>
                    <InfoLabel>스터디 항목</InfoLabel>
                    {requiredSkills?.map((item, idx)=>{
            return <span key={idx}>{item}, </span>
            })}
                  </div>
                </InfoItem>
              </InfoRow>

              <SectionTitle>
                <FiAlertCircle size={20} color="red" style={{marginBottom:"2px"}}/> 스터디 주의사항
              </SectionTitle>
              <WarningBox>{studyWarning}</WarningBox>

              <SectionTitle>
                <FiSend color="#0077cc"/> 스터디 지원 방법
              </SectionTitle>
              <ApplyBox>{applyMethod}</ApplyBox>
            </>
          )}
        </Content>
        <Stats>
          <div className="stat">
            <FiThumbsUp />
            <span>{stats?.likes ?? 0}</span>
          </div>
          {/* <div className="stat">
            <FiMessageCircle />
            <span>{stats?.comments ?? 0}</span>
          </div> */}
        </Stats>
        <hr />
        <CommentSection  boardId={boardId}/>
      </Modal.Body>
    </StyledModal>
  );
};

export default BoardDetailModal;
