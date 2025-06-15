import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiThumbsUp, FiMessageSquare, FiShare2, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { WriteComments, fetchComments, DeleteComments } from '../../../features/community/communitySlice';

// --- Styled Components (이전과 동일) ---
const Card = styled.div`
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  color: #555;
  
  padding-top: 12px;

  svg {
    margin-right: 6px;
  }

  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 24px;
    border-radius: 8px;
    transition: background 0.2s ease;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const CommentInput = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px;
`;

const InputField = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  min-height: 50px;
`;

const Button = styled.button`
  align-self: flex-end;
  padding: 8px 16px;
  background: #0d1117;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: #1f2937;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px 12px;
`;

const SingleComment = styled.div`
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;

  strong {
    font-size: 14px;
    color: #333;
  }
`;

const AuthorTag = styled.span`
  background: #d1e7dd;
  color: #0f5132;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
`;

const TrashButton = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: #d9534f;
    background-color: #ffeaea;
  }
`;
// --- Styled Components 끝 ---

const CommentSection = ({ boardId, onCommentCountChange }) => {
  const dispatch = useDispatch();

  // Redux 스토어에서 boardId에 해당하는 댓글 목록을 가져옵니다.
  const comments = useSelector(state => state.community.commentsByBoardId[boardId] || []);
  const loadingComments = useSelector(state => state.community.loadingComments);

  // showCommentInput 상태는 댓글 입력 필드와 댓글 목록의 가시성을 모두 제어합니다.
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');

  // boardId가 변경될 때마다 댓글을 가져오지만,
  // 이 데이터를 바로 렌더링하지 않고 showCommentInput 상태에 따라 렌더링합니다.
  useEffect(()=>{
    dispatch(fetchComments({ boardId }));
  },[dispatch])

  useEffect(() => {
    // showCommentInput이 true일 때만 fetchComments를 호출하도록 변경
    // 이렇게 하면, 댓글창을 열 때만 API 호출이 발생하여 불필요한 요청을 줄일 수 있습니다.
    if (showCommentInput) {
      console.log(`[CommentSection] boardId 변경 감지 및 댓글창 열림: ${boardId}, 댓글 로드 시작.`);
      dispatch(fetchComments({ boardId }));
    }
  }, [dispatch, boardId, showCommentInput]); // showCommentInput도 의존성 배열에 추가

  // comments 상태가 업데이트될 때마다 실제 comments 값을 확인하고 싶다면 (디버깅용)
  useEffect(() => {
    console.log("현재 commentsByBoardId 상태 (이 boardId의):", comments);
  }, [comments]);

  useEffect(() => {
    // comments 배열이 변경될 때마다 부모에게 댓글 수를 전달
    if (onCommentCountChange) {
      onCommentCountChange(comments.length);
    }
  }, [comments, onCommentCountChange]); // comments 또는 콜백 함수 변경 시 실행

  const handleAddComment = () => {
    if (!comment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    dispatch(WriteComments({ boardId, content: comment }))
      .unwrap()
      .then(() => {
        setComment(''); // 댓글 등록 후 입력 필드 초기화
        // 댓글 등록 후에도 댓글 목록이 보이도록 showCommentInput을 true로 유지하거나,
        // 아니면 다시 닫고 싶다면 setShowCommentInput(false);
        // 여기서는 등록 후 바로 보이게 하기 위해 상태를 유지합니다.
        dispatch(fetchComments({ boardId })); // 댓글 등록 후 최신 목록 가져오기
      })
      .catch(err => {
        console.error('댓글 등록 실패:', err);
        // showToastMessage 등 사용해 사용자에게 실패 메시지 표시
      });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      dispatch(DeleteComments({ commentId }))
        .unwrap()
        .then(() => {
          dispatch(fetchComments({ boardId })); // 삭제 후 갱신
        })
        .catch(err => {
          console.error('댓글 삭제 실패:', err);
          // showToastMessage 등 사용해 사용자에게 실패 메시지 표시
        });
    }
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '';
    return datetime.replace('T', ' ').substring(0, 16);
  };

  return (
    <Card>
      <ActionBar>
        <div><FiThumbsUp /> 좋아요</div>
        {/* "댓글달기" 버튼 클릭 시 showCommentInput 상태를 토글 */}
        <div onClick={() => setShowCommentInput(!showCommentInput)}>
          <FiMessageSquare /> 댓글달기
        </div>
        <div><FiShare2 /> 공유</div>
      </ActionBar>

      {/* showCommentInput이 true일 때만 댓글 입력 필드와 댓글 목록을 렌더링 */}
      {showCommentInput && (
        <>
          <CommentInput>
            <InputField
              placeholder="댓글을 입력하세요"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={2}
            />
            <Button onClick={handleAddComment} disabled={!comment.trim()}>댓글 등록</Button>
          </CommentInput>

          <CommentList>
            {loadingComments === 'pending' ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '12px' }}>댓글 로딩 중...</p>
            ) : comments.length > 0 ? (
              comments.map(({ commentId, writer, content, createAt, mine }) => (
                <SingleComment key={commentId}>
                  <MetaInfo>
                    <strong>{writer}</strong>
                    {mine && <AuthorTag>작성자</AuthorTag>}
                    <span>{formatDateTime(createAt)}</span>
                  </MetaInfo>
                  <div>{content}</div>
                  {mine && (
                    <TrashButton onClick={() => handleDeleteComment(commentId)}>
                      <FiTrash2 />
                    </TrashButton>
                  )}
                </SingleComment>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#888', padding: '12px' }}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            )}
          </CommentList>
        </>
      )}
    </Card>
  );
};

export default CommentSection;