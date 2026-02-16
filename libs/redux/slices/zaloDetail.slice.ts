import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ZaloDetailTab = "groups" | "friends";

type ZaloDetailState = {
    activeTab: ZaloDetailTab;
    groupCount: number;
    friendCount: number;
    groupReloadSignal: number;
    friendReloadSignal: number;
};

const initialState: ZaloDetailState = {
    activeTab: "groups",
    groupCount: 0,
    friendCount: 0,
    groupReloadSignal: 0,
    friendReloadSignal: 0,
};

const zaloDetailSlice = createSlice({
    name: "zaloDetail",
    initialState,
    reducers: {
        setActiveTab(state, action: PayloadAction<ZaloDetailTab>) {
            state.activeTab = action.payload;
        },
        setGroupCount(state, action: PayloadAction<number>) {
            state.groupCount = action.payload;
        },
        setFriendCount(state, action: PayloadAction<number>) {
            state.friendCount = action.payload;
        },
        triggerGroupReload(state) {
            state.groupReloadSignal += 1;
        },
        triggerFriendReload(state) {
            state.friendReloadSignal += 1;
        },
        resetZaloDetailState() {
            return initialState;
        },
    },
});

export const {
    setActiveTab,
    setGroupCount,
    setFriendCount,
    triggerGroupReload,
    triggerFriendReload,
    resetZaloDetailState,
} = zaloDetailSlice.actions;

export default zaloDetailSlice.reducer;
