"use client";

interface GroupListZaloAccountProps {
	id: string;
}

export default function GroupListZaloAccount({ id }: GroupListZaloAccountProps) {
	return (
		<section className="rounded-lg border border-gray-200 bg-white p-4">
			<h2 className="text-lg font-semibold">Danh sách nhóm</h2>
			<div className="mt-2 text-sm text-gray-600">
				Nội dung danh sách nhóm của tài khoản: {id}
			</div>
		</section>
	);
}
