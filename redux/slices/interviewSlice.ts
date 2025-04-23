import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getInterviewsByUserId,
  getInterviewById,
  createFeedback,
  getFeedbackByInterviewId
} from '@/lib/actions/interview.action';

interface InterviewState {
  interviews: Interview[];
  currentInterview: Interview | null;
  feedback: Feedback | null;
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  interviews: [],
  currentInterview: null,
  feedback: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchUserInterviews = createAsyncThunk(
  'interviews/fetchByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
        console.log('it is runed',getInterviewsByUserId(userId))
      return await getInterviewsByUserId(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInterviewById = createAsyncThunk(
  'interviews/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getInterviewById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'interviews/createFeedback',
  async (params: CreateFeedbackParams, { rejectWithValue }) => {
    try {
      return await createFeedback(params);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload || [];
      })
      .addCase(fetchUserInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInterviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInterview = action.payload;
      })
      .addCase(fetchInterviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        // Update state with feedback if needed
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default interviewSlice.reducer;