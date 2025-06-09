import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getHomeProjectList = createAsyncThunk(
    "home/getHomeProjectList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/projects/recent");

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "프로젝트 리스트 조회 실패");
        }
    }
)

const homeSlice = createSlice({
    name: "home",
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHomeProjectList.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(getHomeProjectList.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(getHomeProjectList.rejected, (state) => {
                state.loading = false;
                state.success = false;
                state.error = "프로젝트를 조회하는데 실패했습니다.";
            })
    },
});

export default homeSlice.reducer;