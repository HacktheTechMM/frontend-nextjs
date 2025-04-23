// store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email_verified_at: string | null;
  role: string;
  current_level: string | null;
  specialization: string | null;
  tech_stack: string | null;
  url: string | null;
  last_roadmap_id: number | null;
  provider: string | null;
  provider_id: string | null;
  provider_token: string | null;
  provider_avatar: string | null;
  custom_fields: any;
};

type UserState = {
  current: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  current: null,
  loading: true,
  error: null,
};

export const fetchUser = createAsyncThunk<User, void>(
  'user/fetchUser',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.current = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message || 'Something went wrong';
        state.loading = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
