"use client"

import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const RichTextEditor = dynamic(
    () => import('@mantine/rte').then(mod => mod.RichTextEditor),
    { ssr: false }
);

interface RichTextEditorComponentProp {
    value: string
    onChange: (value: string) => void
}

export default function RichTextEditorComponent({ value, onChange }: RichTextEditorComponentProp) {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className='w-full h-full flex flex-1 justify-center items-center'>
            <Spin />
        </div>
    }

    return (
        <RichTextEditor value={value} onChange={onChange} />
    )
}