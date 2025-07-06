// import { createSlice } from "@reduxjs/toolkit";
// import { useSelector } from 'react-redux';



// const initialState = {
//   accessToken: null,
//   issuedAt: null,
//   expiresIn: "2025-07-03T10:00:00Z",
//   remainingSeconds: 1800
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setTokenData: (state, action) => {
//       const { accessToken, issuedAt, expiresIn } = action.payload;
//       state.accessToken = accessToken;
//       state.issuedAt = issuedAt;
//       state.expiresIn = expiresIn;
//       state.remainingSeconds = expiresIn;
//     },
//     decrementRemaining: (state) => {
//       if (state.remainingSeconds > 0) {
//         state.remainingSeconds -= 1;
//       }
//     },
//     resetRemaining: (state) => {
//       state.remainingSeconds = state.expiresIn;
//     },
//     clearAuth: (state) => {
//       return initialState;
//     }
//   }
// });

// export const { setTokenData, decrementRemaining, resetRemaining, clearAuth } = authSlice.actions;
// export default authSlice.reducer;