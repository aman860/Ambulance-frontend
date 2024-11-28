// src/redux/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define the types for user data
export interface User {
  _id: string;
  username: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  phoneNumber: string;
  description: string;
  title: string;
  address: string;
  role:string
}

interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
}

interface UserState {
  allUsers: {
    users: User[];
    totalPages: number;
    currentPage: number;
  };
  nearbyUsers: {
    users: User[];
    totalPages: number;
    currentPage: number;
  };
  selectedUser: User | null; // Add selectedUser to store the user fetched by ID
  loading: boolean;
  error: string | null;
}

interface FetchNearbyUsersArgs {
  latitude: number;
  longitude: number;
}

interface FetchUserByIdArgs {
  id: string; // User ID
}

// Initial state
const initialState: UserState = {
  allUsers: {
    users: [],
    totalPages: 0,
    currentPage: 0,
  },
  nearbyUsers: {
    users: [],
    totalPages: 0,
    currentPage: 0,
  },
  selectedUser: null, // Initially no user is selected
  loading: false,
  error: null,
};

// Async Thunks
// add role

 
// Fetch all users
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (page: number) => {
    const response = await api.get(`/user/allUsers`, {
      params: { page },
    });
    return response.data; // Expects { users, totalPages, currentPage }
  }
);

// Fetch nearby users based on latitude and longitude
export const getNearbyUsers = createAsyncThunk(
  "users/getNearbyUsers",
  async ({ latitude, longitude, page }: FetchNearbyUsersArgs & { page: number }) => {
    const response = await api.get("/user/getNearbyUsers", {
      params: { latitude, longitude, page },
    });
    return response.data; // Expects { users, totalPages, currentPage }
  }
);

// Fetch a user by ID
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async ({ id }: FetchUserByIdArgs) => {
    const response = await api.get(`/user/userDataById`, {params :{id}});
    return response.data; // Expects a single user object
  }
);

export const removeSelectedUser = createAsyncThunk(
    "users/removeSelectedUser",
    async () => {
       
      return; // Expects a single user object
    }
  );

  //create user
  export const createUser = createAsyncThunk(
    "users/createUser",
    async ({ user }: { user: Partial<User> }) => {
        const response = await api.post(`/user/createUser`, user);
        return response.data;
      }
  );
// Update a user by ID
export const updateUserById = createAsyncThunk(
  "users/updateUserById",
  async ({ id, user }: { id: string; user: Partial<User> }) => {
    const response = await api.put(`/user/userById?id=${id}`, user);
    return response.data;
  }
);

// Delete a user by ID
export const deleteUserById = createAsyncThunk(
  "users/deleteUserById",
  async (id: string) => {
    await api.delete(`/user/userById?id=${id}`);
    return id;
  }
);

// Slice definition
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // create users
    .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        // state.allUsers = {
        //   users: action.payload.users,
        //   totalPages: action.payload.totalPages,
        //   currentPage: action.payload.currentPage,
        // };
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users";
      })
      // Fetch users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.allUsers = {
          users: action.payload.users,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users";
      })
      // Fetch nearby users
      .addCase(getNearbyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.nearbyUsers = {
          users: action.payload.users,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(getNearbyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load nearby users";
      })
      // Fetch user by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.selectedUser = action.payload; // Save the user data to selectedUser
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load user by ID";
      })
      //remove selectedUser
      .addCase(removeSelectedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSelectedUser.fulfilled, (state) => {
        state.loading = false;
       state.selectedUser = null // Save the user data to selectedUser
      })
      .addCase(removeSelectedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load user by ID";
      })
      // Update user by ID
      .addCase(updateUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.allUsers.users = state.allUsers.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
      // Delete user by ID
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.allUsers.users = state.allUsers.users.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export default userSlice.reducer;
