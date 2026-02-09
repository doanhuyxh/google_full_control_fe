import DetailZaloAccount from "@/components/features/zalo-personal/detail-zalo-account";

export const metadata = {
    title: 'Zalo Personal Account',
    description: 'Manage your Zalo personal account settings and information.',
};

export default async function ZaloPersonalAccountDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <DetailZaloAccount id={id} />
    )
}