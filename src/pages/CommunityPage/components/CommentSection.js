import React, { useState } from 'react';
import styled from 'styled-components';
import { FiThumbsUp, FiMessageSquare, FiShare2 } from 'react-icons/fi';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Divider = styled.hr`
  margin: 8px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  color: #555;
  cursor: pointer;

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
      background-color: #f0f0f0; /* 회색 계열 배경 */
    }
  }
`;

const CommentInput = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputField = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
`;

const ReplyInput = styled(InputField)`
  margin-left: 20px;
`;

const Button = styled.button`
  align-self: flex-end;
  padding: 6px 12px;
  background: #0d1117;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #1f2937;
  }
`;

const Comment = styled.div`
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-top: 8px;
`;

const CommentSection = () => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});

  const handleAddComment = () => {
    if (!comment) return;
    setComments([...comments, { text: comment, id: Date.now() }]);
    setComment('');
  };

  const handleAddReply = (id, text) => {
    if (!text) return;
    setReplies(prev => ({ ...prev, [id]: [...(prev[id] || []), text] }));
  };

  return (
    <Card>
      


      <ActionBar>
        <div><FiThumbsUp /> 좋아요</div>
        <div onClick={() => setShowCommentInput(!showCommentInput)}><FiMessageSquare /> 댓글달기</div>
        <div><FiShare2 /> 공유</div>
      </ActionBar>

      {showCommentInput && (
        <CommentInput>
          <InputField
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={2}
          />
          <Button onClick={handleAddComment}>댓글 등록</Button>
        </CommentInput>
      )}

      {comments.map((c) => (
        <div key={c.id}>
          <Comment>{c.text}</Comment>
          <CommentInput>
            <ReplyInput
              placeholder="답글을 입력하세요"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddReply(c.id, e.target.value);
                  e.target.value = '';
                }
              }}
              rows={1}
            />
          </CommentInput>

          {(replies[c.id] || []).map((reply, i) => (
            <ReplyInput key={i} as="div" style={{ background: '#eef2f6' }}>{reply}</ReplyInput>
          ))}
        </div>
      ))}
    </Card>
  );
};

export default CommentSection;
