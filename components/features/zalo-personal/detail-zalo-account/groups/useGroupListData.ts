"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useIndexedDBStorage from "@/libs/hooks/useIndexedDBStorage";
import { ZaloGroup, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getZaloPersonalGroups, getZaloPersonalGroupsDetails } from "@/libs/network/zalo-personal.api";
import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { setGroupsByAccount } from "@/libs/redux/slices/zaloDetail.slice";
import { getAllKeyFromObject, getAllValueFromObject, merchObjectToObject } from "@/libs/utils/JsUtils";

interface UseGroupListDataResult {
	loading: boolean;
	groupDetails: ZaloGroupInfo[];
	setGroupDetails: (value: ZaloGroupInfo[] | ((value: ZaloGroupInfo[]) => ZaloGroupInfo[])) => void;
}

const EMPTY_GROUPS: ZaloGroupInfo[] = [];

export default function useGroupListData(id: string, reloadSignal = 0): UseGroupListDataResult {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const groupDetails = useAppSelector((state) => state.zaloDetail.groupsByAccount[id] || EMPTY_GROUPS);
	const [cachedGroupDetails, setCachedGroupDetails, isCachedGroupDetailsReady] = useIndexedDBStorage<ZaloGroupInfo[]>(`groupDetails_${id}`, []);
	const [groupVersion, setGroupVersion, isGroupVersionReady] = useIndexedDBStorage<string>(`groupDetailsVersion_${id}`, "");
	const firstReloadRenderRef = useRef(true);
	const isFetchingRef = useRef(false);

	const setGroupDetails = (value: ZaloGroupInfo[] | ((value: ZaloGroupInfo[]) => ZaloGroupInfo[])) => {
		const nextValue = value instanceof Function ? value(groupDetails) : value;
		dispatch(setGroupsByAccount({ accountId: id, groups: nextValue }));
		setCachedGroupDetails(nextValue);
	};

	const fetchGroupDetailsFromApi = useCallback(async (forceRefresh = false) => {
		if (isFetchingRef.current) return;
		isFetchingRef.current = true;

		if (!id) {
			setGroupDetails([]);
			setGroupVersion("");
			setLoading(false);
			isFetchingRef.current = false;
			return;
		}

		setLoading(true);

		try {
			const groupsResponse = await getZaloPersonalGroups(id);
			const groupPayload = groupsResponse.data;
			if (!groupsResponse.status || !groupPayload || groupPayload.error_code !== 0 || !groupPayload.data) {
				return;
			}

			const currentVersion = String(groupPayload.data.version || "");
			const hasAnyCachedGroups = groupDetails.length > 0 || cachedGroupDetails.length > 0;
			const canUseCachedGroups = !forceRefresh && currentVersion !== "" && currentVersion === groupVersion && hasAnyCachedGroups;
			if (canUseCachedGroups) {
				if (groupDetails.length === 0 && cachedGroupDetails.length > 0) {
					dispatch(setGroupsByAccount({ accountId: id, groups: cachedGroupDetails }));
				}
				return;
			}

			const gridVerMap = getAllKeyFromObject(groupPayload.data.gridVerMap || {}) || [];
			if (gridVerMap.length === 0) {
				setGroupDetails([]);
				setGroupVersion(currentVersion);
				return;
			}

			const dataMap: Record<string, ZaloGroup> = {};

			for (let i = 0; i < gridVerMap.length; i += 10) {
				const batch = gridVerMap.slice(i, i + 10);
				const detailsResponse = await getZaloPersonalGroupsDetails(id, batch);
				const detailsPayload = detailsResponse.data;
				if (!detailsResponse.status || !detailsPayload || detailsPayload.error_code !== 0) continue;

				const gridInfoMap = detailsPayload.data?.gridInfoMap;
				if (!gridInfoMap) continue;

				merchObjectToObject(dataMap, gridInfoMap);
			}

			setGroupDetails(getAllValueFromObject(dataMap) || []);
			setGroupVersion(currentVersion);
		} catch (error) {
			console.error("Failed to fetch zalo group details", error);
		} finally {
			setLoading(false);
			isFetchingRef.current = false;
		}
	}, [id, groupDetails, cachedGroupDetails, groupVersion, dispatch]);

	useEffect(() => {
		if (!id) return;
		if (!isCachedGroupDetailsReady) return;
		if (groupDetails.length > 0) return;
		if ((cachedGroupDetails || []).length === 0) return;

		dispatch(setGroupsByAccount({ accountId: id, groups: cachedGroupDetails }));
	}, [id, groupDetails.length, cachedGroupDetails, dispatch, isCachedGroupDetailsReady]);

	useEffect(() => {
		setLoading(true);
	}, [id]);

	useEffect(() => {
		if (!id) {
			setGroupDetails([]);
			setGroupVersion("");
			setLoading(false);
			return;
		}

		if (!isCachedGroupDetailsReady || !isGroupVersionReady) return;

		if (groupDetails.length > 0) {
			setLoading(false);
			return;
		}

		if (cachedGroupDetails.length > 0) {
			dispatch(setGroupsByAccount({ accountId: id, groups: cachedGroupDetails }));
			setLoading(false);
			return;
		}

		fetchGroupDetailsFromApi(false);
	}, [id, groupDetails.length, cachedGroupDetails, dispatch, isCachedGroupDetailsReady, isGroupVersionReady]);

	useEffect(() => {
		if (!id) return;
		if (!isCachedGroupDetailsReady || !isGroupVersionReady) return;

		if (firstReloadRenderRef.current) {
			firstReloadRenderRef.current = false;
			return;
		}

		fetchGroupDetailsFromApi(true);
	}, [reloadSignal, id, isCachedGroupDetailsReady, isGroupVersionReady]);

	return {
		loading,
		groupDetails,
		setGroupDetails,
	};
}
