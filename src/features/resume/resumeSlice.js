import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';


export const resumeRegister = createAsyncThunk(
  "resume/resumeRegister",
  async ({ values, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      console.log("accessToken:", token);
      console.log("이력서values", values);
      const response = await api.post("/api/resume/create", values,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      dispatch(
        showToastMessage({
          message: "이력서를 등록하였습니다!",
          status: "success",
        })
      );
      
      console.log("이력서 등록 데이터", response.data);
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "이력서 등록 실패",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "이력서 등록 실패");
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },
  reducers: {
    resetResumeState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resumeRegister.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(resumeRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
      })
      .addCase(resumeRegister.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      });
  },
});

export const { resetResumeState } = resumeSlice.actions;
export default resumeSlice.reducer;
