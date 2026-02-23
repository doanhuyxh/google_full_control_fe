"use client";

import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useDebounce } from "@/libs/hooks/useDebounce";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";
import { ChangedProfiles } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getAllFrendInZalo } from "@/libs/network/zalo-personal.api";
import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { setFriendsByAccount } from "@/libs/redux/slices/zaloDetail.slice";
import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, Collapse, Input, Skeleton, Space, Tooltip, type CollapseProps } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

interface FriendListZaloAccountProps {
	id: string;
	reloadSignal?: number;
	onCountChange?: (count: number) => void;
}

const EMPTY_FRIENDS: ChangedProfiles[] = [];

export default function FriendListZaloAccount({ id, reloadSignal = 0, onCountChange }: FriendListZaloAccountProps) {
	const { notification } = useAntdApp();
	const dispatch = useAppDispatch();
	const [mounted, setMounted] = useState(false);
	const friends = useAppSelector((state) => state.zaloDetail.friendsByAccount[id] || EMPTY_FRIENDS);
	const [cachedFriends, setCachedFriends] = useLocalStorage<ChangedProfiles[]>(`zalo-personal-friends:${id}`, []);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const debouncedSearchText = useDebounce(searchText, 300);
	const [activeKeys, setActiveKeys] = useState<string[]>([]);
	const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
	const firstReloadRenderRef = useRef(true);
	const [currentThreadId, setZaloChatThreadId] = useSearchParamsClient<string>("threadId", "");
	const [__, setZaloThreadType] = useSearchParamsClient<string>("threadType", "0");

	const fetchFriends = async () => {
		setLoading(true);
		const response = await getAllFrendInZalo(id);
		if (!response.status) {
			notification.error({
				message: "Lỗi kết nối",
				description: response.message || "Không thể lấy danh sách bạn bè",
			});
			setLoading(false);
			return;
		}
		if (response.data.error_code !== 0) {
			notification.error({
				message: "Lỗi phản hồi",
				description: response.data.error_message || "Không thể lấy danh sách bạn bè",
			});
			setLoading(false);
			return;
		}
		const latestFriends = response.data.data || [];
		dispatch(setFriendsByAccount({ accountId: id, friends: latestFriends }));
		setCachedFriends(latestFriends);
		setLoading(false);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!id) return;
		if (friends.length > 0) return;
		if ((cachedFriends || []).length === 0) return;

		dispatch(setFriendsByAccount({ accountId: id, friends: cachedFriends }));
	}, [id, cachedFriends, friends.length, dispatch]);

	useEffect(() => {
		setActiveKeys([]);
		setSelectedFriendIds([]);
		setSearchText("");
		fetchFriends();
	}, [id]);

	useEffect(() => {
		if (firstReloadRenderRef.current) {
			firstReloadRenderRef.current = false;
			return;
		}
		fetchFriends();
	}, [reloadSignal]);

	useEffect(() => {
		onCountChange?.(friends.length);
	}, [friends.length, onCountChange]);

	const filteredFriends = useMemo(() => {
		const keyword = debouncedSearchText.trim().toLowerCase();
		if (!keyword) return friends;

		return friends.filter((friend) => {
			const fullText = `${friend.displayName || ""} ${friend.zaloName || ""} ${friend.username || ""} ${friend.userId || ""}`.toLowerCase();
			return fullText.includes(keyword);
		});
	}, [friends, debouncedSearchText]);

	const toggleFriendSelection = (friendId: string, checked: boolean) => {
		setSelectedFriendIds((prev) => {
			if (checked) {
				if (prev.includes(friendId)) return prev;
				return [...prev, friendId];
			}
			return prev.filter((id) => id !== friendId);
		});
	};

	const handleSendMessage = (friend: ChangedProfiles) => {
		setZaloChatThreadId(friend.userId);
		setZaloThreadType("0");
		setActiveKeys([friend.userId]);
	};

	const renderFriendLabel = (friend: ChangedProfiles) => {
		const isCurrentThread = currentThreadId === friend.userId;

		return (
		<div
			className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 pr-2 transition-colors ${
				isCurrentThread ? "bg-blue-50" : ""
			}`}
		>
			<div className="flex min-w-0 items-center gap-2">
				<Avatar src={friend.avatar} alt={friend.displayName} size={30} />
				<p className={`line-clamp-2 ${isCurrentThread ? "text-blue-600 font-medium" : ""}`}>
					{friend.displayName || friend.userId}
				</p>
			</div>
			<Space size={4} onClick={(event) => event.stopPropagation()}>
				<Tooltip title="Gửi tin nhắn mặc định cho bạn bè">
					<Button
						type={isCurrentThread ? "primary" : "text"}
						size="small"
						icon={<MessageOutlined />}
						onClick={(event) => {
							event.stopPropagation();
							handleSendMessage(friend);
						}}
					/>
				</Tooltip>
				<div onClick={(event) => event.stopPropagation()}>
					<Checkbox
						checked={selectedFriendIds.includes(friend.userId)}
						onChange={(event) => toggleFriendSelection(friend.userId, event.target.checked)}
					/>
				</div>
			</Space>
		</div>
		);
	};

	const items: CollapseProps["items"] = filteredFriends.map((friend) => ({
		key: friend.userId,
		label: renderFriendLabel(friend),
		className: currentThreadId === friend.userId ? "!border-blue-500" : undefined,
		children: (
			<div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
				<div>
					<span className="font-medium">Zalo ID:</span> {friend.userId || "-"}
				</div>
				<div>
					<span className="font-medium">Username:</span> {friend.username || "-"}
				</div>
				<div>
					<span className="font-medium">Zalo name:</span> {friend.zaloName || "-"}
				</div>
				<div>
					<span className="font-medium">SĐT:</span> {friend.phoneNumber || "-"}
				</div>
				<div className="md:col-span-2">
					<span className="font-medium">Status:</span> {friend.status || "-"}
				</div>
			</div>
		),
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

	if (friends.length === 0) {
		return <div>Không có bạn bè nào</div>;
	}

	return (
		<section className="rounded-lg">
			<Input.Search
				placeholder="Tìm kiếm bạn bè"
				className="mb-4"
				allowClear
				value={searchText}
				onChange={(event) => setSearchText(event.target.value)}
			/>
			{filteredFriends.length === 0 ? (
				<div>Không tìm thấy bạn bè phù hợp</div>
			) : (
				<Collapse className="max-h-[70vh] overflow-auto" items={items} activeKey={activeKeys} onChange={onChange} />
			)}
		</section>
	);
}
