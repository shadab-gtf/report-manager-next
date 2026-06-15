"use client";

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession } from "@/types/auth";

interface UiState {
  sidebarCollapsed: boolean;
}

interface AuthState {
  session: AuthSession | null;
}

const uiInitialState: UiState = {
  sidebarCollapsed: false,
};

const authInitialState: AuthState = {
  session: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: uiInitialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload;
    },
    clearSession(state) {
      state.session = null;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed } = uiSlice.actions;
export const { setSession, clearSession } = authSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
