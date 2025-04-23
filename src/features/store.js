import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import projectSlice from "./post/projectSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    project: projectSlice,
    ui: uiSlice,
  },
});
export default store;
