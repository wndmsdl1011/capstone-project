import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

export const approveCompany = createAsyncThunk(
  "admin/approveCompany",
  async ({ status, companyId}, { dispatch, rejectWithValue }) => {
    try {
      console.log("status, companyId", status, companyId);
      const response = await api.patch(`/api/admin/companies/${companyId}/approve`,{},{
        params:{
          status: status
        }

      });
      if(status == "APPROVED"){
        dispatch(
        showToastMessage({
          message: "승인하였습니다!",
          status: "success",
        })
      );
      }else{
        dispatch(
        showToastMessage({
          message: "거절하였습니다",
          status: "error",
        })
      );
      }
      
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
      const response = await api.get("/api/admin/companies/pending",  {
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
    pendingCompanyList: [],
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
        state.pendingCompanyList = action.payload// 수정해야함
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
