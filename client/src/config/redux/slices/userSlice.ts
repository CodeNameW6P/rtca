import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserStateType = {
    isAuthenticated: boolean;
    _id: string | null;
    username: string | null;
    email: string | null;
    profilePicture: string | null;
    createdAt: string | null;
};

const initialState: UserStateType = {
    isAuthenticated: false,
    _id: null,
    username: null,
    email: null,
    profilePicture: null,
    createdAt: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signIn: (
            state,
            action: PayloadAction<{
                _id: string;
                username: string;
                email: string;
                profilePicture: string;
                createdAt: string;
            }>
        ) => {
            state.isAuthenticated = true;
            state._id = action.payload._id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.profilePicture = action.payload.profilePicture;
            state.createdAt = action.payload.createdAt;
        },
        signOut: (state) => {
            state.isAuthenticated = false;
            state._id = null;
            state.username = null;
            state.email = null;
            state.profilePicture = null;
            state.createdAt = null;
        },
    },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
