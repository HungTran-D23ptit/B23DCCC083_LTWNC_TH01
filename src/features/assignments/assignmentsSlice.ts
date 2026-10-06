import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DeadlineStatusFilter } from '../../types/deadline.types';
import type {
  Assignment,
  CreateAssignmentDTO,
  UpdateAssignmentDTO,
  PriorityLevel,
} from '../../types/deadline.types';
import {
  fetchAssignmentsFromApi,
  syncAssignmentsToStorage,
  initialMockAssignments,
} from '../../api/mockDeadlineApi';

export interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  statusFilter: DeadlineStatusFilter;
  selectedSubject: string;
  selectedPriority: PriorityLevel | 'ALL';
  searchTerm: string;
  sortBy: 'urgentFirst' | 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title';
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  statusFilter: DeadlineStatusFilter.ALL,
  selectedSubject: 'ALL',
  selectedPriority: 'ALL',
  searchTerm: '',
  sortBy: 'urgentFirst',
};

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (options: { simulateError?: boolean; delayMs?: number } = {}) => {
    const response = await fetchAssignmentsFromApi(options);
    return response;
  }
);

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<CreateAssignmentDTO>) => {
      const newAssignment: Assignment = {
        ...action.payload,
        id: `ASN-${Date.now().toString().slice(-6)}`,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.unshift(newAssignment);
      syncAssignmentsToStorage(state.items);
    },

    toggleComplete: (state, action: PayloadAction<string>) => {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (assignment) {
        assignment.completed = !assignment.completed;
        assignment.completedAt = assignment.completed
          ? new Date().toISOString()
          : undefined;
        assignment.updatedAt = new Date().toISOString();
        syncAssignmentsToStorage(state.items);
      }
    },

    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      syncAssignmentsToStorage(state.items);
    },

    updateAssignment: (
      state,
      action: PayloadAction<{ id: string; changes: UpdateAssignmentDTO }>
    ) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
        };
        syncAssignmentsToStorage(state.items);
      }
    },

    setStatusFilter: (state, action: PayloadAction<DeadlineStatusFilter>) => {
      state.statusFilter = action.payload;
    },

    setSelectedSubject: (state, action: PayloadAction<string>) => {
      state.selectedSubject = action.payload;
    },

    setSelectedPriority: (state, action: PayloadAction<PriorityLevel | 'ALL'>) => {
      state.selectedPriority = action.payload;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<
        'urgentFirst' | 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title'
      >
    ) => {
      state.sortBy = action.payload;
    },

    resetToDefaultMockData: (state) => {
      state.items = initialMockAssignments;
      syncAssignmentsToStorage(initialMockAssignments);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Lỗi khi tải danh sách bài tập từ máy chủ';
      });
  },
});

export const {
  addAssignment,
  toggleComplete,
  deleteAssignment,
  updateAssignment,
  setStatusFilter,
  setSelectedSubject,
  setSelectedPriority,
  setSearchTerm,
  setSortBy,
  resetToDefaultMockData,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
