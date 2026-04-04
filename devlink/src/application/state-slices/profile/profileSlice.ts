import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { ProfileState } from "./profileSlice.types";

const tokenKey = "token";

const decodeToken = (token: string | null): ProfileState => {
  let decoded = token !== null ? jwtDecode<{ nameid: string; name: string; email: string; exp: number }>(token) : null;
  const now = Date.now() / 1000;

  if (decoded?.exp && decoded.exp < now) {
    decoded = null;
    token = null;
    localStorage.removeItem(tokenKey);
  }

  return {
    loggedIn: token !== null,
    token: token ?? null,
    userId: decoded?.nameid ?? null,
    name: decoded?.name ?? null,
    email: decoded?.email ?? null,
    exp: decoded?.exp ?? null,
  };
};

const getInitialState = (): ProfileState => decodeToken(localStorage.getItem(tokenKey));

export const profileSlice = createSlice({
  name: "profile",
  initialState: getInitialState(),
  reducers: {
    setToken: (_, action: PayloadAction<string>) => {
      localStorage.setItem(tokenKey, action.payload);
      return decodeToken(action.payload);
    },
    resetProfile: () => {
      localStorage.removeItem(tokenKey);
      return {
        loggedIn: false,
        token: null,
        userId: null,
        name: null,
        email: null,
        exp: null,
      };
    },
  },
});

export const { setToken, resetProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
