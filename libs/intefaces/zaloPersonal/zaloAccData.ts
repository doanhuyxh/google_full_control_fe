
export interface InfoLogin {
    name: string
    avatar: string
}

export interface ZaloLoginInfo {
    logged: boolean
    session_chat_valid: boolean
    info: InfoLogin
}

export interface BizPkg {
    label: any
    pkgId: number
}

export interface UnchangedProfiles { }

export interface ChangedProfiles {
    userId: string
    username: string
    displayName: string
    zaloName: string
    avatar: string
    bgavatar: string
    cover: string
    gender: number
    dob: number
    sdob: string
    status: string
    phoneNumber: string
    isFr: number
    isBlocked: number
    lastActionTime: number
    lastUpdateTime: number
    isActive: number
    key: number
    type: number
    isActivePC: number
    isActiveWeb: number
    isValid: number
    userKey: string
    accountStatus: number
    oaInfo: any
    user_mode: number
    globalId: string
    bizPkg: BizPkg
    createdTs: number
    oa_status: any
}

export interface ZaloPersonalInfo {
    unchanged_profiles: UnchangedProfiles
    phonebook_version: number
    changed_profiles: ChangedProfiles
}

export interface ZaloGroup {
    version: string;
    gridVerMap: Record<string, string>;
}

export interface SettingZaloGroup {
    blockName: number
    signAdminMsg: number
    addMemberOnly: number
    setTopicOnly: number
    enableMsgHistory: number
    lockCreatePost: number
    lockCreatePoll: number
    joinAppr: number
    bannFeature: number
    dirtyMedia: number
    banDuration: number
    lockSendMsg: number
    lockViewMember: number
}

export interface PendingApproveZaloGroup {
    time: number
    uids: any
}

export interface ExtraInfoZaloGroup {
    enable_media_store: number
}

export interface ZaloGroupInfo {
    groupId: string
    name: string
    desc: string
    type: number
    creatorId: string
    version: string
    avt: string
    fullAvt: string
    memberIds: any[]
    adminIds: any[]
    currentMems: any[]
    updateMems: any[]
    memVerList: string[]
    admins: any[]
    hasMoreMember: number
    subType: number
    totalMember: number
    maxMember: number
    setting: SettingZaloGroup
    createdTime: number
    visibility: number
    globalId: string
    e2ee: number
    pendingApprove: PendingApproveZaloGroup
    extraInfo: ExtraInfoZaloGroup
}

export interface ZaloPersonalGroupData {
    removedsGroup: any[]
    unchangedsGroup: any[]
    gridInfoMap: Record<string, ZaloGroupInfo>
}

export interface ProfilesMemberGroup {
    displayName: string
    zaloName: string
    avatar: string
    accountStatus: number
    type: number
    lastUpdateTime: number
    globalId: string
    id: string
}

export interface ZaloPersonalGroupMemberData {
    profiles: Record<string, ProfilesMemberGroup>
    unchangeds_profile: any[]
}
