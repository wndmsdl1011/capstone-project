import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // api.js가 'src/utils/api.js'에 있을 경우

import { showToastMessage } from "../common/uiSlice";
import { fetchNotifications } from '../notification/notificationSlice';
import { setTokenData } from '../auth/authSlice';

// 지침 사항
// 툴킷 로그인, 회원가입 샘플
// 예시이니 변경있을 수 있음.
// userSlice는 로그인 회원가입 관련 툴킷 리듀스 스토어라고 보면 됨
// 개발하면서 유동적으로 폴더 및 파일 생성해가면서 Slice를 추가시키면 됨
// 예로 번호팅 사이트에서 사용자가 포스트잇을 생성해서 그 정보들을 백엔드와 연동하고 싶으면
// post라는 폴더 만들고 그 안에 postSlice 이런식으로 파일을 만들고 그안에 프론트 툴킷 기능들을 이 및 샘플과 같은 형식으로 코드를 작성하면 됨됨
// featueres가 리듀스 툴킷 쓰는 파일들, postSlice를 만들었으면 store.js 객체안에도 넣어서 적용시켜주면 됨, post : postSlice이렇게
// page나 라우터도 어떤 대략적인 페이지들만 설정해논거라 알아서 유동적으로 페이지 추가시 라우터도 수정 바람.
export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async (
    { email, password, role, navigate },
    { dispatch, rejectWithValue }
  ) => {
    console.log("email,role", email, role);
    try {
      const response = await api.post("/api/login", { email, password, role }); // post로 보내줌
      console.log(response);
      //성공
      //Loginpage에서 처리
      // 토큰저장
      //1. local storage(페이지 닫혔다 켜져도 다시 유지)
      //2. session storage (새로고침하면 유지, 페이지 닫히면 유지x)

      const authHeader = response.headers.authorization;
      const {expiresAt} = response.data;
      const accessToken = authHeader.replace("Bearer ", "").trim();
      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("expires_at", expiresAt); // ⬅️ 추가 저장
       // 상태 저장
      // dispatch(
      //   setTokenData({
      //     accessToken,
      //     issuedAt,
      //     expiresIn
      //   })
      // );

      await dispatch(fetchUserProfile());
      await dispatch(fetchNotifications());
      dispatch(
        showToastMessage({
          message: "로그인을 성공했습니다!",
          status: "success",
        })
      );
      navigate("/");
      console.log("로그인 데이터", response.data);
      return {
        ...response.data,
        // expiresIn을 ms → 초 변환
        expiresIn: Math.floor(response.data.expiresIn / 1000),
      };
    } catch (error) {
      //실패
      //실패시 생긴 에러값을 reducer에 저장
      dispatch(
        showToastMessage({
          message: "아이디 또는 비밀번호가 일치하지 않습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const reissueToken = createAsyncThunk(
  "user/reissueToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      console.log(token);
      const response = await api.post("/api/reissue",
        {},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const {accessToken, expiresIn, expiresAt} = response.data;

      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("expires_at", expiresAt); // ⬅️ 추가 저장
      dispatch(
        showToastMessage({
          message: "세션이 연장되었습니다.",
          status: "success"
        })
      );
      console.log("리프래시 데이터",response.data);
      return {
        ...response.data,
        expiresAt,
        expiresIn: Math.floor(expiresIn / 1000),
      }
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "세션 연장에 실패했습니다.",
          status: "error"
        })
      );
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => { }
);

export const logout = createAsyncThunk(
  "user/logout",
  async ({ token, navigate }, { dispatch }) => {
    try {
      if (token) {
        await api.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("로그아웃 실패", error);
    } finally {
      // 토큰 그냥 무조건 제거
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("expires_at");
      navigate("/login")
    }
  }
);

// 회원가입 요청 처리 (Redux 비동기 함수) - 주은 수정
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ values, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/api/register/account", values);

      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      navigate("/login");
      return response.data;
    } catch (error) {
      alert("전화번호 중복입니다.");
      return rejectWithValue(error.response?.data || "전화번호 중복입니다.");
    }
  }
);

export const registerCompany = createAsyncThunk(
  "user/registerCompany",
  async ({ values, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/api/register/company", values);

      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      navigate("/login");
      return response.data;
    } catch (error) {
      alert("전화번호 및 사업자등록번호 중복입니다.");
      return rejectWithValue(
        error.response?.data || "전화번호 및 사업자등록번호 중복입니다."
      );
    }
  }
);

export const checkEmailAvailability = createAsyncThunk(
  "user/checkEmailAvailability",
  async (email, { rejectWithValue }) => {
    try {
      console.log("email", email);
      const response = await api.get("/api/email/exist", {
        params: { email: email },
      });
      console.log("중복 데이터 확인", response.data);
      return response.data;
    } catch (error) {
      alert("이미 사용 중인 이메일입니다.")
      const errorMessage = error.response?.data || "이미 사용 중인 이메일입니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

// 회원 정보 불러오기
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await api.get("/api/mypage", {
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

// 회원 정보 수정
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (
    { userName, email, gender, age, nickname, contact, major, location },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.put("/user/profile", {
        userName,
        email,
        gender,
        nickname,
        age,
        contact,
        major,
        location,
      });

      dispatch(
        showToastMessage({
          message: "회원 정보가 성공적으로 수정되었습니다.",
          status: "success",
        })
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원 정보 수정에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || "회원 정보 수정 실패");
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    // _는 주는 정보 없음
    // 토큰은 login했을 때 저장됨 그 로직 짜러 가야함 login with email ㄱㄱ
    try {
      // 다시 뭐 get TKoen을 할필요가 없음 우리는 이미 api.js에서 headrs에 token을 설정시켜놨기 떄문 그래서 이 토큰이 누구의 토큰인지만 요청해주면 됨
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// export const RefreshWithToken = createAsyncThunk(
//   "user/loginWithToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/api/reissue");
//       console.log("refresh토큰", response.data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.error);
//     }
//   }
// );

const storedExpiresAt = sessionStorage.getItem("expires_at");
const currentTime = new Date();
const expireTime = storedExpiresAt ? new Date(storedExpiresAt) : null;
const calculatedExpiresIn = expireTime ? Math.floor((expireTime - currentTime) / 1000) : 0;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
    loginError: null,
    checkEmailError: null,
    registrationError: null,
    success: false,
    profile: null,
    emailmessage: "",
    userRole: "",

  accessToken: null,
  issuedAt: null,
  expiresAt: storedExpiresAt,
  expiresIn: calculatedExpiresIn > 0 ? calculatedExpiresIn : 0,
  },
  reducers: {
    // 직접적으로 호출
    setUser: (state, action) => {
      state.user = action.payload; // user 정보 업데이트
    },
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
      state.emailmessage = "";
      state.checkEmailError = "";
    },
    setRole: (state, action) => {
      state.userRole = action.payload;
    },
    logout,
    decrementRemaining: (state) => {
      if (state.expiresIn > 0) {
        state.expiresIn -= 1;
      }
    },
    clearAuth: (state) => {
      state.user = {};
      state.accessToken = null;
      state.expiresAt = null;
      state.expiresIn = 0;
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("expires_at");
    },

  },
  extraReducers: (builder) => {
    // async처럼 외부의 함수를 통해 호출
    builder
      .addCase(registerUser.pending, (state) => {
        // 데이터 기다림, state는 initialState를 넘겨줌
        state.loading = true; // 로딩스피너
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      }) // 성공
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      }) // 실패
      .addCase(registerCompany.pending, (state) => {
        // 데이터 기다림, state는 initialState를 넘겨줌
        state.loading = true; // 로딩스피너
      })
      .addCase(registerCompany.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      }) // 성공
      .addCase(registerCompany.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        sessionStorage.setItem("userRole", action.payload.role); // 여기에서 저장 // 로그인이 성공적이라면 이 user값을 init initialState: { user: null, 여기에 넣어주겠다
        const {expiresIn, expiresAt} = action.payload;
        state.expiresAt = expiresAt;
        state.expiresIn = expiresIn;
        state.user = action.payload;
        state.loginError = null; // 로그인 에러는 null로 바꿔주고
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(reissueToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(reissueToken.fulfilled, (state, action) => {
        state.loading = false;
        const {expiresIn, expiresAt} = action.payload;
        state.expiresAt = expiresAt;
        state.expiresIn = expiresIn;
        state.user = action.payload;
        state.loginError = null; // 로그인 에러는 null로 바꿔주고
      })
      .addCase(reissueToken.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      // .addCase(loginWithToken.pending, (state,action)=>{
      //   //로딩스피너 보여줄 필요 없음 그냥 유저 체크하는 것임
      // })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user; // 유저값 찾았으면 그냥 토큰 세팅만 해주면 됨
      })
      // .addCase(loginWithToken.rejected, (state,action)=>{
      //   //유저값을 찾는건 이미 뒤에서 진행되는 것이니 유저값을 못찾으면
      //다시 그냥 유저가 로그인 페이지를 다시 로그인할 수 있게 해주면 됨 필요x
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.loginError = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(checkEmailAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkEmailAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.emailmessage = action.payload.message;
        state.checkEmailError = null;
      })
      .addCase(checkEmailAvailability.rejected, (state, action) => {
        state.loading = false;
        state.emailmessage = null;
        state.checkEmailError = action.payload;
      })
      .addCase(logout.fulfilled, () => {
        return {
          user: null,
          loading: false,
          loginError: null,
          registrationError: null,
          success: false,
        };
      });
  },
});
export const { clearErrors, setRole, decrementRemaining,clearAuth} = userSlice.actions;
export default userSlice.reducer;
