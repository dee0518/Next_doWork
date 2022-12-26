import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { iUserInfo } from 'types/auth';

type authType = {
  user: iUserInfo | null;
};

const initialState: authType = {
  user: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<iUserInfo>): void => {
      state.user = action.payload;
    },
  },
});

export const authActions = auth.actions;
export default auth;
