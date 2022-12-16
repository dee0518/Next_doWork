import { configureStore } from '@reduxjs/toolkit';
import auth from 'redux/auth';

export const store = configureStore({
  reducer: { auth: auth.reducer },
});

export type ReducerType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;