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
        project: [],
        error: "",
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHomeProjectList.fulfilled, (state, action) => {
                state.project = action.payload;
            })
            .addCase(getHomeProjectList.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default homeSlice.reducer;