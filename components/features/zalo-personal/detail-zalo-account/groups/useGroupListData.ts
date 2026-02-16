"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import { ZaloGroup, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getZaloPersonalGroups, getZaloPersonalGroupsDetails } from "@/libs/network/zalo-personal.api";
import { getAllKeyFromObject, getAllValueFromObject, merchObjectToObject } from "@/libs/utils/JsUtils";

interface UseGroupListDataResult {
	loading: boolean;
	groupDetails: ZaloGroupInfo[];
	setGroupDetails: (value: ZaloGroupInfo[] | ((value: ZaloGroupInfo[]) => ZaloGroupInfo[])) => void;
}

export default function useGroupListData(id: string, reloadSignal = 0): UseGroupListDataResult {
	const [loading, setLoading] = useState(true);
	const [groupDetails, setGroupDetails] = useLocalStorage<ZaloGroupInfo[]>(`groupDetails_${id}`, []);
	const [groupVersion, setGroupVersion] = useLocalStorage<string>(`groupDetailsVersion_${id}`, "");

	useEffect(() => {
		setLoading(true);
	}, [id]);

	useEffect(() => {
		let cancelled = false;

		const loadGroups = async () => {
			if (!id) {
				if (!cancelled) {
					setGroupDetails([]);
					setGroupVersion("");
					setLoading(false);
				}
				return;
			}

			if (!cancelled) setLoading(true);

			const groupsResponse = await getZaloPersonalGroups(id);
			if (!groupsResponse.status) {
				if (!cancelled) setLoading(false);
				return;
			}

			const currentVersion = String(groupsResponse.data.data.version || "");
			const canUseCachedGroups = currentVersion !== "" && currentVersion === groupVersion && groupDetails.length > 0;
			if (canUseCachedGroups) {
				if (!cancelled) setLoading(false);
				return;
			}

			const gridVerMap = getAllKeyFromObject(groupsResponse.data.data.gridVerMap) || [];
			if (gridVerMap.length === 0) {
				if (!cancelled) {
					setGroupDetails([]);
					setGroupVersion(currentVersion);
					setLoading(false);
				}
				return;
			}

			const dataMap: Record<string, ZaloGroup> = {};

			for (let i = 0; i < gridVerMap.length; i += 10) {
				const batch = gridVerMap.slice(i, i + 10);
				const detailsResponse = await getZaloPersonalGroupsDetails(id, batch);
				if (!detailsResponse.status) continue;

				merchObjectToObject(dataMap, detailsResponse.data.data.gridInfoMap);
			}

			if (!cancelled) {
				setGroupDetails(getAllValueFromObject(dataMap) || []);
				setGroupVersion(currentVersion);
				setLoading(false);
			}
		};

		loadGroups();

		return () => {
			cancelled = true;
		};
	}, [id, groupVersion, groupDetails.length, reloadSignal]);

	return {
		loading,
		groupDetails,
		setGroupDetails,
	};
}
