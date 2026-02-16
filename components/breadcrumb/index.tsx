import { Breadcrumb } from 'antd';

interface BreadcrumbComponentProps {
    array?: { title: React.ReactNode; href?: string }[];
}

export default function BreadcrumbComponent({ array }: BreadcrumbComponentProps) {
    return (
        <Breadcrumb
            items={array?.map((item) => ({
                title: item.title,
                href: item.href,
            })) || []}
        />
    )
}