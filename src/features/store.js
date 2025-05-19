import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import projectSlice from "./post/projectSlice";
import resumeSlice from "./resume/resumeSlice"
const store = configureStore({
  reducer: {
    user: userSlice,
    project: projectSlice,
    ui: uiSlice,
    resume:resumeSlice,
    // admin:adminSlice,
  },
});
export default store;
