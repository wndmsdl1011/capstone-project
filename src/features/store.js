import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import projectSlice from "./post/projectSlice";
import resumeSlice from "./resume/resumeSlice";
import adminSlice from "./admin/adminSlice";
import communitySlice from "./community/communitySlice"
import homeSlice from "./home/homeSlice"
import notificationSlice from "./notification/notificationSlice"
import authSlice from "./auth/authSlice"
const store = configureStore({
  reducer: {
    user: userSlice,
    project: projectSlice,
    ui: uiSlice,
    resume: resumeSlice,
    admin: adminSlice,
    community: communitySlice,
    home: homeSlice,
    notification:notificationSlice,
    auth:authSlice,
  },
});

export default store;
