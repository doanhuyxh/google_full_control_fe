export type ColumnVisibilityOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

export const FIXED_COLUMN_KEYS = ["index", "actions"] as const;

/** Single source of truth: visibility option `value` === table column `key`. */
export const COLUMN_OPTIONS: ColumnVisibilityOption[] = [
    { label: "STT", value: "index", disabled: true },
    { label: "AVATAR", value: "avatar" },
    { label: "Họ và tên", value: "fullName" },
    { label: "Email", value: "email" },
    { label: "Số điện thoại", value: "phoneNumber" },
    { label: "Mật khẩu", value: "currentPassword" },
    { label: "App Password", value: "appPassword" },
    { label: "OAuth2", value: "oauthTwoTokens" },
    { label: "Email khôi phục", value: "recoveryEmail" },
    { label: "Recovery Phone", value: "recoveryPhoneNumber" },
    { label: "F2A", value: "f2a" },
    { label: "Mã bí mật", value: "privateCode" },
    { label: "Tài nguyên sử dụng", value: "resources_used" },
    { label: "Email hôm nay", value: "totalSendMailToday" },
    { label: "Driver Strong Use", value: "totalDriverStrongUse" },
    { label: "Trạng thái", value: "status" },
    { label: "Ghi chú", value: "note" },
    { label: "Ngày tạo", value: "createdAt" },
    { label: "Hành động", value: "actions", disabled: true },
];

export const DEFAULT_VISIBLE_COLUMNS = COLUMN_OPTIONS.map((option) => option.value);

export const COLUMN_LABEL_BY_KEY = Object.fromEntries(
    COLUMN_OPTIONS.map((option) => [option.value, option.label]),
) as Record<string, string>;
