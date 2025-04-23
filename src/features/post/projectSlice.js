import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 액션: 프로젝트 공고 등록
export const postProject = createAsyncThunk(
  "project/postProject",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      console.log("accessToken:", token);
      const response = await axios.post(
        "http://localhost:8080/api/create/project",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
        
      );
      console.log(token); // 유효한 JWT인지 확인

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },
  reducers: {
    resetProjectState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postProject.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
      })
      .addCase(postProject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
