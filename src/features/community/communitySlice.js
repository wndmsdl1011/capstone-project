import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

import { showToastMessage } from '../common/uiSlice';

export const CreateBoard = createAsyncThunk(
  'community/CreateBoard',
  async ({ postData, navigate }, { dispatch, rejectWithValue }) => {
    console.log('values', postData);
    try {
      const response = await api.post('/api/create/board', postData);

      dispatch(
        showToastMessage({
          message: '게시글을 등록하였습니다!',
          status: 'success',
        })
      );
      navigate('/community');
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: '게시글 등록 실패',
          status: 'error',
        })
      );

      return rejectWithValue(error.response?.data || '게시글 등록 실패.');
    }
  }
);

export const fetchBoardList = createAsyncThunk(
  'community/fetchBoardList',
  async ({ page, size, selectedTab }, { rejectWithValue }) => {
    console.log("page, size, selectedTab", page, size, selectedTab);
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await api.get(
        `/api/board/list`,
        {
          params: {
            page: page,
            size: size,
            boardType : selectedTab
          },
        }
      );
      console.log("커뮤니티 데이터",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBoardDetail = createAsyncThunk(
  'community/fetchBoardDetail',
  async ({ boardId }, { rejectWithValue }) => {
    try {
      console.log("boardId", boardId);
      const response = await api.get(
        `/api/boards/${boardId}/detail`,);
      console.log("커뮤니티 디테일 데이터",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateBoard = createAsyncThunk(
  'community/UpdateBoard',
  async ({ postData, navigate,boardId}, { dispatch, rejectWithValue }) => {
    console.log('values', postData);
    try {
      const response = await api.put(`/api/boards/${boardId}/update`, postData);

      dispatch(
        showToastMessage({
          message: '게시글을 수정하였습니다!',
          status: 'success',
        })
      );
      navigate('/community');
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: '게시글 수정 실패',
          status: 'error',
        })
      );

      return rejectWithValue(error.response?.data || '게시글 수정 실패.');
    }
  }
);

export const DeleteBoard = createAsyncThunk(
  'community/UpdateBoard',
  async ({boardId}, { dispatch, rejectWithValue }) => {
    
    try {
      const response = await api.delete(`/api/boards/${boardId}/delete`);

      dispatch(
        showToastMessage({
          message: '게시글을 삭제하였습니다!',
          status: 'success',
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: '게시글 삭제 실패',
          status: 'error',
        })
      );

      return rejectWithValue(error.response?.data || '게시글 삭제 실패.');
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
    boardList: [],
    boardDetailList:[],
    page: 1,
    totalPages: 0,
    projectDetail: null,
    applicants: [],
  },
  reducers: {
    // 직접적으로 호출
    resetProjectState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateBoard.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(CreateBoard.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchBoardList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardList.fulfilled, (state, action) => {
        const { postits, page, total_pages } = action.payload;
        console.log("postits", postits);
        if (page === 1) {
          state.boardList = postits; // 1번 페이지 저장
        } else {
          // 해당 페이지 포함 다른 페이지 누적 저장.
          state.boardList = [...state.boardList, ...postits];
        }
        
        state.page = page;
        state.totalPages = total_pages;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBoardList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBoardDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoardDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.boardDetailList = action.payload;
      })
      .addCase(fetchBoardDetail.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(DeleteBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteBoard.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(DeleteBoard.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});
export const { clearErrors } = communitySlice.actions;
export default communitySlice.reducer;
