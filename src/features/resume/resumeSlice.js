import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const resumeRegister = createAsyncThunk(
  "resume/resumeRegister",
  async ({ values, imageFile, navigate }, { dispatch, rejectWithValue }) => {
    try {
      console.log("imageFile", imageFile);
      const token = sessionStorage.getItem("access_token");
      console.log("accessToken:", token);
      console.log("이력서values", values);
      const formData = new FormData();
      if (values.projects) {
        values.projects = values.projects.map((project) => ({
          ...project,
          startDate: project.startDate || null,
          endDate: project.endDate || null,
        }));
      }
      const dtoBlob = new Blob([JSON.stringify(values)], {
        type: "application/json",
      });
      formData.append("dto", dtoBlob);

      if (imageFile) {
        formData.append("photo", imageFile);
      }
      console.log("formData", formData);
      const response = await api.post("/api/resume/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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

export const getResumeList = createAsyncThunk(
  "resume/getResumeList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/resume/list", {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "이력서 리스트 조회 실패");
    }
  }
);

export const getResumeDetail = createAsyncThunk(
  "resume/getResumeDetail",
  async (resumeId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await api.get(`/api/resume/${resumeId}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "이력서 조회 실패");
    }
  }
);

export const resumeUpdate = createAsyncThunk(
  "resume/resumeUpdate",
  async (
    { values, imageFile, resumeId, navigate, wherePage },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const formData = new FormData();
      if (values.projects) {
        values.projects = values.projects.map((project) => ({
          ...project,
          startDate: project.startDate || null,
          endDate: project.endDate || null,
        }));
      }
      const dtoBlob = new Blob([JSON.stringify(values)], {
        type: "application/json",
      });
      formData.append("dto", dtoBlob);

      if (imageFile) {
        formData.append("photo", imageFile);
      }
      const response = await api.put(
        `/api/resume/${resumeId}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(
        showToastMessage({
          message: "이력서를 수정하였습니다!",
          status: "success",
        })
      );

      if (wherePage == "/mypage/user") {
        navigate(wherePage, { state: { selectedMenu: "이력서 관리" } });
      } else if (wherePage == "/resumelist") {
        navigate(wherePage);
      }

      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "이력서 수정 실패",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "이력서 수정 실패");
    }
  }
);

export const resumeDelete = createAsyncThunk(
  "resume/resumeDelete",
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await api.delete(`/api/resume/${resumeId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        showToastMessage({
          message: "이력서를 삭제하였습니다!",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "이력서 삭제 실패",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "이력서 삭제 실패");
    }
  }
);

export const resumeVisible = createAsyncThunk(
  "resume/resumeVisible",
  async ({ visible, resumeId }, { dispatch, rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await api.patch(
        `/api/resume/${resumeId}/visible?visible=${visible}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(
        showToastMessage({
          message: "이력서 공개범위를 수정하였습니다!",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "이력서 공개범위 수정 실패",
          status: "error",
        })
      );
      return rejectWithValue(
        error.response?.data || "이력서 공개범위 수정 실패"
      );
    }
  }
);

export const resumeAImatching = createAsyncThunk(
  "resume/resumeAImatching",
  async ({ startDate, endDate , resumeId }, { dispatch, rejectWithValue }) => {
    console.log("ai데이터",startDate, endDate, resumeId)
    try {
      const response = await api.post(
        `/api/gemini/completion/top3/${resumeId}`,
        {},
        {
          params : {
            startDate : startDate,
            endDate : endDate
          }
        }
      );
      dispatch(
        showToastMessage({
          message: "AI 매칭 성공!",
          status: "success",
        })
      );
      console.log("Redux: AI매칭 응답 데이터:", response.data);
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "AI 매칭 실패",
          status: "error",
        })
      );
      dispatch(aiListClear());
      return rejectWithValue(
        error.response?.data || "AI 매칭 실패"
      );
    }
  }
);


const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    currentResume: null,
    loading: false,
    success: false,
    error: null,
    message: null,
    newResume: false,
    resumeNumber: null,
    wherePage: '',
    aiMatchingTop3:[],
    resumeList:[]
  },
  reducers: {
    aiListClear: (state) => {
      state.aiMatchingTop3 = [];
    },
    resetResumeState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
      state.aiMatchingTop3 = [];
    },
    originResume: (state) => {
      state.newResume = false;
    },
    myPageResume: (state) => {
      state.wherePage = "/mypage/user";
    },
    resumelistPage: (state) => {
      state.wherePage = "/resumelist";
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
        state.newResume = true;
      })
      .addCase(resumeRegister.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      })
      .addCase(getResumeList.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getResumeList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || null;
        state.resumeNumber = action.payload?.length;
        state.resumeList = action.payload
      })
      .addCase(getResumeList.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.message || "오류가 발생했습니다.";
      })
      .addCase(getResumeDetail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getResumeDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentResume = action.payload;
        state.message = action.payload?.message || null;
      })
      .addCase(getResumeDetail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      })
      .addCase(resumeUpdate.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(resumeUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
      })
      .addCase(resumeUpdate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      })
      .addCase(resumeVisible.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(resumeVisible.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
      })
      .addCase(resumeVisible.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      })
      .addCase(resumeDelete.fulfilled, (state) => {
        state.resumeNumber = state.resumeNumber - 1;
      })
      .addCase(resumeAImatching.pending, (state) => {
        state.success = false;
        state.error = null;
      })
      .addCase(resumeAImatching.fulfilled, (state, action) => {
        state.success = true;
        state.aiMatchingTop3 = action.payload;
        state.message = action.payload?.message || null;
      })
      .addCase(resumeAImatching.rejected, (state, action) => {
        state.success = false;
        state.error = action.payload?.message || "오류가 발생했습니다.";
      });
  },
});

export const { resetResumeState, originResume, myPageResume, resumelistPage,aiListClear } = resumeSlice.actions;
export default resumeSlice.reducer;
