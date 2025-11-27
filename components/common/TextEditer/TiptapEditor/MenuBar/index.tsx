'use client'

import { Button, Tooltip, Space } from 'antd'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Undo,
    Redo,
    Type,
    List,
    ListOrdered,
    Code2,
    Quote,
    Slash,
} from 'lucide-react'
import type { Editor } from '@tiptap/react'

interface MenuBarProps {
    editor: Editor | null
}

export function MenuBar({ editor }: MenuBarProps) {
    if (!editor) return null
    const isActive = (format: string, options?: any) => editor.isActive(format, options)
    return (
        <Space wrap className="mb-2">
            <Tooltip title="Bold">
                <Button
                    type={isActive('bold') ? 'primary' : 'default'}
                    icon={<Bold size={16} />}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
            </Tooltip>

            <Tooltip title="Italic">
                <Button
                    type={isActive('italic') ? 'primary' : 'default'}
                    icon={<Italic size={16} />}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />
            </Tooltip>

            <Tooltip title="Strike">
                <Button
                    type={isActive('strike') ? 'primary' : 'default'}
                    icon={<Strikethrough size={16} />}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                />
            </Tooltip>

            <Tooltip title="Code">
                <Button
                    type={isActive('code') ? 'primary' : 'default'}
                    icon={<Code size={16} />}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                />
            </Tooltip>

            <Tooltip title="Paragraph">
                <Button
                    type={isActive('paragraph') ? 'primary' : 'default'}
                    icon={<Type size={16} />}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                />
            </Tooltip>

            {[1, 2, 3, 4, 5, 6].map(level => (
                <Tooltip key={level} title={`Heading H${level}`}>
                    <Button
                        type={isActive('heading', { level }) ? 'primary' : 'default'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    >
                        H{level}
                    </Button>
                </Tooltip>
            ))}

            <Tooltip title="Bullet List">
                <Button
                    type={isActive('bulletList') ? 'primary' : 'default'}
                    icon={<List size={16} />}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
            </Tooltip>

            <Tooltip title="Ordered List">
                <Button
                    type={isActive('orderedList') ? 'primary' : 'default'}
                    icon={<ListOrdered size={16} />}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
            </Tooltip>

            <Tooltip title="Code Block">
                <Button
                    type={isActive('codeBlock') ? 'primary' : 'default'}
                    icon={<Code2 size={16} />}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                />
            </Tooltip>

            <Tooltip title="Blockquote">
                <Button
                    type={isActive('blockquote') ? 'primary' : 'default'}
                    icon={<Quote size={16} />}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                />
            </Tooltip>

            <Tooltip title="Horizontal Rule">
                <Button icon={<Slash size={16} />} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
            </Tooltip>

            <Tooltip title="Undo">
                <Button
                    icon={<Undo size={16} />}
                    disabled={!editor.can().chain().focus().undo().run()}
                    onClick={() => editor.chain().focus().undo().run()}
                />
            </Tooltip>

            <Tooltip title="Redo">
                <Button
                    icon={<Redo size={16} />}
                    disabled={!editor.can().chain().focus().redo().run()}
                    onClick={() => editor.chain().focus().redo().run()}
                />
            </Tooltip>
        </Space>
    )
}
