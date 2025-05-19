import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const approveCompany = createAsyncThunk(
  "admin/approveCompany",
  async ({ values, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/api/register/account", values);

      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "승인에러");
    }
  }
);

export const fetchPendingCompanies = createAsyncThunk(
  "admin/fetchPendingCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await api.get("/api/mypage",  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      console.log("Redux: 응답 데이터:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "회원 정보를 불러오는데 실패했습니다."
      );
    }
  }
);



const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
    PendingCompanyList: [],
    totalPages: 0,
    projectDetail: null,
  },
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.PendingCompanyList = action.payload.postits; // 수정해야함
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchPendingCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message ||
              "기업 목록을 불러오는 데 실패했습니다.";
      })
      
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
