// src/store/notificationSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Spring 백엔드의 EventPayload 구조에 맞게 정의 (JavaScript 객체)
// interface EventPayload {
//   type: string; // "apply"
//   message: string;
//   projectId: number;
//   senderName: string;
//   date: string; // LocalDate.now().toString() 형식
// }
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const userRole = sessionStorage.getItem("userRole");
      const response = await api.get(`/api/received`,{
        params: {
            role : userRole
          },
      }
        
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "알림 조회 실패");
    }
  }
);

const initialState = {
  latestNotification: null,
  // 나중에 알림 목록을 관리하게 된다면 여기에 추가할 수 있습니다.
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLatestNotification: (state, action) => {
      state.latestNotification = action.payload;
      // 알림 목록에 추가하고 싶다면:
      // state.notifications.unshift(action.payload); // 최신 알림을 앞에 추가
    },
    clearLatestNotification: (state) => {
      state.latestNotification = null;
    },
    // 나중에 알림 목록을 위한 추가 리듀서도 고려할 수 있습니다.
    // addNotification: (state, action) => {
    //   state.notifications.push(action.payload);
    // },
    // clearAllNotifications: (state) => {
    //   state.notifications = [];
    // },
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchNotifications.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchNotifications.fulfilled, (state,action) => {
          state.loading = false;
          state.error = null;
          state.notifications = action.payload;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
          state.error = action.payload;
        })

    },
  
});

export const { setLatestNotification, clearLatestNotification } = notificationSlice.actions;

export default notificationSlice.reducer;