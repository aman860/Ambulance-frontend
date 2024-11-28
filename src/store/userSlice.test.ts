// userSlice.test.ts
import {EnhancedStore } from '@reduxjs/toolkit';
 
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userReducer, {
  User,
  getUsers,
  getNearbyUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  removeSelectedUser,
} from './userSlice';

interface RootState {
  users: ReturnType<typeof userReducer>;
}

const mock = new MockAdapter(axios);

describe('userSlice', () => {
  let store: EnhancedStore<RootState>;

  it('should return the initial state', () => {
    const initialState = store.getState().users;
    expect(initialState).toEqual({
      allUsers: { users: [], totalPages: 0, currentPage: 0 },
      nearbyUsers: { users: [], totalPages: 0, currentPage: 0 },
      selectedUser: null,
      loading: false,
      error: null,
    });
  });

  it('should handle getUsers fulfilled', async () => {
    const mockData = {
      users: [
        {
          _id: '1',
          username: 'John',
          location: { type: 'Point', coordinates: [10, 20] },
          phoneNumber: '12345',
          description: 'Test',
          title: 'User',
          address: 'Address',
          role: 'Admin',
        },
      ],
      totalPages: 2,
      currentPage: 1,
    };
    mock.onGet('/user/allUsers').reply(200, mockData);

    await store.dispatch(getUsers(1) as any);

    const state = store.getState().users;
    expect(state.allUsers).toEqual(mockData);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle getNearbyUsers fulfilled', async () => {
    const mockData = {
      users: [
        {
          _id: '2',
          username: 'Doe',
          location: { type: 'Point', coordinates: [30, 40] },
          phoneNumber: '67890',
          description: 'Nearby Test',
          title: 'User',
          address: 'Nearby Address',
          role: 'User',
        },
      ],
      totalPages: 1,
      currentPage: 1,
    };
    mock.onGet('/user/getNearbyUsers').reply(200, mockData);

    await store.dispatch(getNearbyUsers({ latitude: 30, longitude: 40, page: 1 }) as any);

    const state = store.getState().users;
    expect(state.nearbyUsers).toEqual(mockData);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle getUserById fulfilled', async () => {
    const mockUser: User = {
      _id: '1',
      username: 'John',
      location: { type: 'Point', coordinates: [10, 20] },
      phoneNumber: '12345',
      description: 'Details Test',
      title: 'User',
      address: 'Address',
      role: 'Admin',
    };
    mock.onGet('/user/userDataById').reply(200, mockUser);

    await store.dispatch(getUserById({ id: '1' }) as any);

    const state = store.getState().users;
    expect(state.selectedUser).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle createUser fulfilled', async () => {
    const newUser: User = {
      _id: '3',
      username: 'Jane',
      location: { type: 'Point', coordinates: [50, 60] },
      phoneNumber: '11223',
      description: 'New User',
      title: 'User',
      address: 'New Address',
      role: 'User',
    };
    mock.onPost('/user/createUser').reply(200, newUser);

    await store.dispatch(createUser({ user: newUser }) as any);

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle updateUserById fulfilled', async () => {
    const updatedUser: User = {
      _id: '1',
      username: 'John Updated',
      location: { type: 'Point', coordinates: [10, 20] },
      phoneNumber: '12345',
      description: 'Updated Test',
      title: 'User',
      address: 'Updated Address',
      role: 'Admin',
    };
    mock.onPut('/user/userById?id=1').reply(200, updatedUser);

    await store.dispatch(updateUserById({ id: '1', user: updatedUser }) as any);

    const state = store.getState().users;
    expect(state.allUsers.users.find((user) => user._id === '1')).toEqual(updatedUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle deleteUserById fulfilled', async () => {
    mock.onDelete('/user/userById?id=1').reply(200);

    await store.dispatch(deleteUserById('1') as any);

    const state = store.getState().users;
    expect(state.allUsers.users.find((user) => user._id === '1')).toBeUndefined();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle removeSelectedUser fulfilled', async () => {
    await store.dispatch(removeSelectedUser() as any);

    const state = store.getState().users;
    expect(state.selectedUser).toBeNull();
  });
});
