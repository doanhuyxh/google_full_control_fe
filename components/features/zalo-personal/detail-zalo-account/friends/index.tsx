"use client";

interface FriendListZaloAccountProps {
	id: string;
}

export default function FriendListZaloAccount({ id }: FriendListZaloAccountProps) {
	return (
		<section className="rounded-lg border border-gray-200 bg-white p-4">
			<h2 className="text-lg font-semibold">Danh sách bạn bè</h2>
			<div className="mt-2 text-sm text-gray-600">
				Nội dung danh sách bạn bè của tài khoản: {id}
			</div>
		</section>
	);
}
