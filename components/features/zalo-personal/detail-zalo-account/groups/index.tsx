"use client";

import useLocalStorage from "@/libs/hooks/useLocalStorage";
import { ZaloGroup, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getZaloPersonalGroups, getZaloPersonalGroupsDetails, leaveZaloGroup } from "@/libs/network/zalo-personal.api";
import { getAllKeyFromObject, getAllValueFromObject, merchObjectToObject } from "@/libs/utils/JsUtils";
import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Button, Checkbox, Collapse, Skeleton, Space, Tooltip, type CollapseProps } from "antd";
import GroupItem from "./group-item";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useModal } from "@/libs/hooks/useModal";

interface GroupListZaloAccountProps {
	id: string;
}

export default function GroupListZaloAccount({ id }: GroupListZaloAccountProps) {
	const { notification } = useAntdApp();
	const [mounted, setMounted] = useState(false); // ⭐ tránh hydration lỗi
	const [loading, setLoading] = useState(true); // ⭐ skeleton state
	const [gridVerMap, setGridVerMap] = useState<string[]>([]);
	const [groupDetails, setGroupDetails] = useLocalStorage<ZaloGroupInfo[]>(`groupDetails_${id}`, []);
	const [activeKeys, setActiveKeys] = useState<string[]>([]);
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
	const { showConfirm } = useModal();

	// ⭐ đảm bảo chỉ render sau khi mount client
	useEffect(() => {
		setMounted(true);
	}, []);

	// ⭐ reset khi đổi account
	useEffect(() => {
		setGroupDetails([]);
		setGridVerMap([]);
		setSelectedGroupIds([]);
	}, [id]);

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

	const handleSendDefaultMessage = (group: ZaloGroupInfo) => {
		notification.info({
			message: "Thông báo",
			description: `Đã chọn gửi tin nhắn mặc định vào nhóm: ${group.name}`,
		});
	};

	const renderGroupLabel = (group: ZaloGroupInfo) => (
		<div className="flex w-full items-center justify-between gap-2 pr-2">
			<span className="truncate">{group.name}</span>
			<Space size={4} onClick={(event) => event.stopPropagation()}>
				<Tooltip title="Gửi tin nhắn mặc định vào nhóm">
					<Button
						type="text"
						size="small"
						icon={<MessageOutlined />}
						onClick={(event) => {
							event.stopPropagation();
							handleSendDefaultMessage(group);
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

	const items: CollapseProps["items"] = groupDetails.map((group) => ({
		key: group.groupId,
		label: renderGroupLabel(group),
		children: <GroupItem item={group} />,
	}));

	const onChange = (key: string | string[]) => {
		setActiveKeys(Array.isArray(key) ? key : [key]);
	};

	const fetchGroups = async () => {
		if (!id) return;

		// đã có cache → không cần loading skeleton
		if (groupDetails.length > 0) {
			setLoading(false);
			return;
		}

		const response = await getZaloPersonalGroups(id);
		if (response.status) {
			setGridVerMap(getAllKeyFromObject(response.data.data.gridVerMap) || []);
		}
	};

	const fetchDetailsGroup = async () => {
		if (gridVerMap.length === 0) return;

		const dataMap: Record<string, ZaloGroup> = {};

		for (let i = 0; i < gridVerMap.length; i += 10) {
			const batch = gridVerMap.slice(i, i + 10);
			const response = await getZaloPersonalGroupsDetails(id, batch);
			if (!response.status) continue;

			merchObjectToObject(dataMap, response.data.data.gridInfoMap);
		}

		setGroupDetails(getAllValueFromObject(dataMap) || []);
		setLoading(false); // ⭐ xong loading
	};

	useEffect(() => {
		fetchGroups();
	}, [id]);

	useEffect(() => {
		fetchDetailsGroup();
	}, [gridVerMap]);

	// ⭐ tránh hydration mismatch hoàn toàn
	if (!mounted) return null;

	// ⭐ Skeleton UI
	if (loading) {
		return (
			<section className="rounded-lg border border-gray-200 bg-white p-4">
				<Skeleton active paragraph={{ rows: 4 }} />
			</section>
		);
	}

	// ⭐ Không có dữ liệu
	if (groupDetails.length === 0) {
		return <div>Không có nhóm nào</div>;
	}

	return (
		<section className="rounded-lg border border-gray-200 max-h-[78vh] overflow-auto">
			<Collapse items={items} activeKey={activeKeys} onChange={onChange} />
		</section>
	);
}
