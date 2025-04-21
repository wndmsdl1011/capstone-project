import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import postSlice from "./post/projectSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    ui: uiSlice,
  },
});
export default store;