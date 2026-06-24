import DetailZaloAccount from "@/components/features/zalo-personal/detail-zalo-account";

export const metadata = {
    title: 'Zalo Personal Account',
    description: 'Manage your Zalo personal account settings and information.',
};

type ZaloPersonalAccountDetailProps = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ZaloPersonalAccountDetailPage({ params }: ZaloPersonalAccountDetailProps) {
    const { id } = await params;
    return (
        <DetailZaloAccount id={id} />
    )
}