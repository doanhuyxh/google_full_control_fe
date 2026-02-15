

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