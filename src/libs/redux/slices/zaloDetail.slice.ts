import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangedProfiles, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";

export type ZaloDetailTab = "groups" | "friends";

type ZaloDetailState = {
    activeTab: ZaloDetailTab;
    groupCount: number;
    friendCount: number;
    groupReloadSignal: number;
    friendReloadSignal: number;
    friendsByAccount: Record<string, ChangedProfiles[]>;
    groupsByAccount: Record<string, ZaloGroupInfo[]>;
};

const initialState: ZaloDetailState = {
    activeTab: "groups",
    groupCount: 0,
    friendCount: 0,
    groupReloadSignal: 0,
    friendReloadSignal: 0,
    friendsByAccount: {},
    groupsByAccount: {},
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
        setFriendsByAccount(
            state,
            action: PayloadAction<{ accountId: string; friends: ChangedProfiles[] }>
        ) {
            state.friendsByAccount[action.payload.accountId] = action.payload.friends;
        },
        setGroupsByAccount(
            state,
            action: PayloadAction<{ accountId: string; groups: ZaloGroupInfo[] }>
        ) {
            state.groupsByAccount[action.payload.accountId] = action.payload.groups;
        },
        removeFriendsByAccount(state, action: PayloadAction<string>) {
            delete state.friendsByAccount[action.payload];
        },
        removeGroupsByAccount(state, action: PayloadAction<string>) {
            delete state.groupsByAccount[action.payload];
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
    setFriendsByAccount,
    setGroupsByAccount,
    removeFriendsByAccount,
    removeGroupsByAccount,
    resetZaloDetailState,
} = zaloDetailSlice.actions;

export default zaloDetailSlice.reducer;
