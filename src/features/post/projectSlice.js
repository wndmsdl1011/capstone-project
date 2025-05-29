import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션: 프로젝트 공고 등록
export const postProject = createAsyncThunk(
  "project/postProject",
  async (formData, { dispatch, rejectWithValue }) => {
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
      dispatch(
        showToastMessage({
          message: "프로젝트 등록이 완료되었습니다.",
          status: "success",
        })
      );
      console.log(token); // 유효한 JWT인지 확인

      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "프로젝트 등록에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

// 비동기 액션: 프로젝트 공고 목록 조회
export const fetchProjectList = createAsyncThunk(
  "project/fetchProjectList",
  async ({ page, size }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/project/list?page=${page}&size=${size}`
      );
      // dispatch(
      //   showToastMessage({
      //     message: "프로젝트 목록 불러오기에 성공했습니다.",
      //     status: "success",
      //   })
      // );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "프로젝트 목록 불러오기에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

// 비동기 액션: 프로젝트 상세 조회
export const fetchProjectDetail = createAsyncThunk(
  "project/fetchProjectDetail",
  async (projectId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/project/${projectId}/detail`
      );
      // dispatch(
      //   showToastMessage({
      //     message: "프로젝트 상세 조회에 성공했습니다.",
      //     status: "success",
      //   })
      // );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "프로젝트 상세 조회에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "조회 실패");
    }
  }
);

// 비동기 액션: 프로젝트 지원하기
export const applyToProject = createAsyncThunk(
  "project/applyToProject",
  async ({ projectId, resumeId }, { dispatch, rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(
        `http://localhost:8080/api/project/${projectId}/apply/${resumeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(
        showToastMessage({
          message: "프로젝트 지원에 성공했습니다.",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "프로젝트 지원 실패",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "지원 실패");
    }
  }
);

// 비동기 액션: 프로젝트 지원자 선택 (합격/불합격 처리)
export const updateApplicantStatus = createAsyncThunk(
  "project/updateApplicantStatus",
  async ({ projectId, applyId, status }, { dispatch, rejectWithValue }) => {
    try {
      console.log("status", projectId, applyId, status);
      const token = sessionStorage.getItem("access_token");
      const response = await axios.patch(
        `http://localhost:8080/api/projects/${projectId}/applicants/${applyId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: status,
          },
        }
      );
      dispatch(
        showToastMessage({
          message: response.data.message || "지원자 상태가 변경되었습니다.",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message:
            error.response?.data?.message || "지원자 상태 변경에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(
        error.response?.data || "지원자 상태 변경에 실패했습니다."
      );
    }
  }
);

// 비동기 액션: 프로젝트 지원자 목록 조회
export const fetchProjectApplicants = createAsyncThunk(
  "project/fetchProjectApplicants",
  async (projectId, { dispatch, rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8080/api/project/${projectId}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // dispatch(
      //   showToastMessage({
      //     message: "지원자 목록 조회에 성공했습니다.",
      //     status: "success",
      //   })
      // );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "지원자 목록 조회에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "지원자 목록 조회 실패");
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
    projectList: [],
    totalPages: 0,
    projectDetail: null,
    applicants: [],
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
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "프로젝트 등록에 실패했습니다.";
      })
      .addCase(fetchProjectList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectList.fulfilled, (state, action) => {
        state.loading = false;
        state.projectList = action.payload.postits;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchProjectList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message ||
              "프로젝트 목록을 불러오는 데 실패했습니다.";
      })
      .addCase(fetchProjectDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.projectDetail = action.payload;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "프로젝트 상세 조회에 실패했습니다.";
      })
      .addCase(fetchProjectApplicants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload.map((applicant) => ({
          applyId: applicant.applyId,
          accountId: applicant.accountId,
          name: applicant.name,
          photo: applicant.photo,
          devposition: applicant.devposition,
          status: applicant.status,
          appliedAt: applicant.appliedAt,
          resume: {
            resumeId: applicant.resume.resumeId,
            title: applicant.resume.title,
            intro: applicant.resume.intro,
            devposition: applicant.resume.devposition,
            skills: applicant.resume.skills,
            photo: applicant.resume.photo,
            visible: applicant.resume.visible,
            projects: applicant.resume.projects,
            githubUrl: applicant.resume.githubUrl,
            introduce: applicant.resume.introduce,
          },
        }));
      })
      .addCase(fetchProjectApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "지원자 목록 조회에 실패했습니다.";
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
