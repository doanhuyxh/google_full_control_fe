"use client";

import { ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { leaveZaloGroup } from "@/libs/network/zalo-personal.api";
import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Collapse, Input, Skeleton, Space, Tooltip, type CollapseProps } from "antd";
import GroupItem from "./group-item";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useModal } from "@/libs/hooks/useModal";
import { useDebounce } from "@/libs/hooks/useDebounce";
import useGroupListData from "./useGroupListData";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";

interface GroupListZaloAccountProps {
	id: string;
	reloadSignal?: number;
	onCountChange?: (count: number) => void;
}

export default function GroupListZaloAccount({ id, reloadSignal = 0, onCountChange }: GroupListZaloAccountProps) {
	const { notification } = useAntdApp();
	const [mounted, setMounted] = useState(false);
	const { loading, groupDetails, setGroupDetails } = useGroupListData(id, reloadSignal);
	const [searchText, setSearchText] = useState("");
	const debouncedSearchText = useDebounce(searchText, 300);
	const [activeKeys, setActiveKeys] = useState<string[]>([]);
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
	const { showConfirm } = useModal();
	const [_, setZaloChatThreadId] = useSearchParamsClient<string>("threadId", "");
	const [__, setZaloThreadType] = useSearchParamsClient<string>("threadType", "1");

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		setActiveKeys([]);
		setSelectedGroupIds([]);
		setSearchText("");
	}, [id]);

	useEffect(() => {
		onCountChange?.(groupDetails.length);
	}, [groupDetails.length, onCountChange]);

	const filteredGroups = useMemo(() => {
		const keyword = debouncedSearchText.trim().toLowerCase();
		if (!keyword) return groupDetails;

		return groupDetails.filter((group) => group.name?.toLowerCase().includes(keyword));
	}, [groupDetails, debouncedSearchText]);

	const toggleGroupSelection = (groupId: string, checked: boolean) => {
		setSelectedGroupIds((prev) => {
			if (checked) {
				if (prev.includes(groupId)) return prev;
				return [...prev, groupId];
			}
			return prev.filter((id) => id !== groupId);
		});
	};

	const handleLeaveGroup = async (group: ZaloGroupInfo) => {
		showConfirm({
			title: "Xác nhận rời nhóm",
			content: `Bạn có chắc chắn muốn rời nhóm "${group.name}"?`,
			okType: "danger",
			onOk: async () => {
				const response = await leaveZaloGroup(id, group.groupId);
				if (!response.status) {
					notification.error({
						message: "Lỗi",
						description: response.message || "Đã có lỗi xảy ra khi rời nhóm.",
					});
					return;
				}
				if (response.data.error_code != 0) {
					notification.error({
						message: "Lỗi",
						description: response.data.error_message || "Đã có lỗi xảy ra khi rời nhóm.",
					});
					return;
				}
				notification.success({
					message: "Thành công",
					description: `Bạn đã rời nhóm "${group.name}" thành công.`,
				});
				setGroupDetails((prev) => prev.filter((g) => g.groupId !== group.groupId));
				setSelectedGroupIds((prev) => prev.filter((id) => id !== group.groupId));
			},
		});
	};

	const handleSendMessage = (group: ZaloGroupInfo) => {
		setZaloChatThreadId(group.groupId);
		setZaloThreadType("1");
	};

	const renderGroupLabel = (group: ZaloGroupInfo) => (
		<div className="flex w-full items-center justify-between gap-2 pr-2">
			<p className="line-clamp-2">{group.name}</p>
			<Space size={4} onClick={(event) => event.stopPropagation()}>
				<Tooltip title="Gửi tin nhắn mặc định vào nhóm">
					<Button
						type="text"
						size="small"
						icon={<MessageOutlined />}
						onClick={(event) => {
							event.stopPropagation();
							handleSendMessage(group);
						}}
					/>
				</Tooltip>
				<Tooltip title="Rời nhóm">
					<Button
						type="text"
						size="small"
						danger
						icon={<LogoutOutlined />}
						onClick={(event) => {
							event.stopPropagation();
							handleLeaveGroup(group);
						}}
					/>
				</Tooltip>
				<div onClick={(event) => event.stopPropagation()}>
					<Checkbox
						checked={selectedGroupIds.includes(group.groupId)}
						onChange={(event) => toggleGroupSelection(group.groupId, event.target.checked)}
					/>
				</div>
			</Space>
		</div>
	);

	const items: CollapseProps["items"] = filteredGroups.map((group) => ({
		key: group.groupId,
		label: renderGroupLabel(group),
		children: <GroupItem item={group} accountId={id} />,
	}));

	const onChange = (key: string | string[]) => {
		setActiveKeys(Array.isArray(key) ? key : [key]);
	};

	if (!mounted) return null;

	if (loading) {
		return (
			<section className="rounded-lg border border-gray-200 bg-white p-4">
				<Skeleton active paragraph={{ rows: 4 }} />
			</section>
		);
	}

	if (groupDetails.length === 0) {
		return <div>Không có nhóm nào</div>;
	}

	return (
		<section className="rounded-lg">
			<Input.Search
				placeholder="Tìm kiếm nhóm"
				className="mb-4"
				allowClear
				value={searchText}
				onChange={(event) => setSearchText(event.target.value)}
			/>
			{filteredGroups.length === 0 ? (
				<div>Không tìm thấy nhóm phù hợp</div>
			) : (
				<Collapse
					className="max-h-[70vh] overflow-auto"
					items={items}
					activeKey={activeKeys}
					onChange={onChange} />
			)}
		</section>
	);
}
