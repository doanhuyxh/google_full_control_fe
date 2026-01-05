'use client'

import { useState } from 'react'
import { Button, Tooltip, Space, Modal, Input } from 'antd'
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
    Link as LinkIcon,
    Youtube as YoutubeIcon,
} from 'lucide-react'
import type { Editor } from '@tiptap/react'

interface MenuBarProps {
    editor: Editor | null
}

export function MenuBar({ editor }: MenuBarProps) {
    const [linkModalOpen, setLinkModalOpen] = useState(false)
    const [youtubeModalOpen, setYoutubeModalOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [linkText, setLinkText] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')

    if (!editor) return null

    const isActive = (format: string, options?: any) => editor.isActive(format, options)

    const handleInsertLink = () => {
        if (!linkUrl) return

        if (linkText) {
            // Insert new text with link
            editor.chain().focus().insertContent({
                type: 'text',
                text: linkText,
                marks: [{ type: 'link', attrs: { href: linkUrl } }],
            }).run()
        } else {
            // Apply link to selected text
            editor.chain().focus().setLink({ href: linkUrl }).run()
        }

        setLinkUrl('')
        setLinkText('')
        setLinkModalOpen(false)
    }

    const handleInsertYoutube = () => {
        if (!youtubeUrl) return

        editor.chain().focus().setYoutubeVideo({
            src: youtubeUrl,
            width: 640,
            height: 360,
        }).run()

        setYoutubeUrl('')
        setYoutubeModalOpen(false)
    }

    const openLinkModal = () => {
        const { from, to } = editor.state.selection
        const selectedText = editor.state.doc.textBetween(from, to, '')

        if (selectedText) {
            setLinkText(selectedText)
        }

        setLinkModalOpen(true)
    }

    return (
        <>
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
                            onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
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

                <Tooltip title="Insert Link">
                    <Button
                        type={isActive('link') ? 'primary' : 'default'}
                        icon={<LinkIcon size={16} />}
                        onClick={openLinkModal}
                    />
                </Tooltip>

                <Tooltip title="Insert YouTube Video">
                    <Button
                        icon={<YoutubeIcon size={16} />}
                        onClick={() => setYoutubeModalOpen(true)}
                    />
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

            {/* Link Modal */}
            <Modal
                title="Chèn Link"
                open={linkModalOpen}
                onOk={handleInsertLink}
                onCancel={() => {
                    setLinkModalOpen(false)
                    setLinkUrl('')
                    setLinkText('')
                }}
                okText="Chèn"
                cancelText="Hủy"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">URL:</label>
                        <Input
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onPressEnter={handleInsertLink}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Văn bản hiển thị (tùy chọn):</label>
                        <Input
                            placeholder="Nhập văn bản hiển thị"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            onPressEnter={handleInsertLink}
                        />
                    </div>
                </div>
            </Modal>

            {/* YouTube Modal */}
            <Modal
                title="Chèn Video YouTube"
                open={youtubeModalOpen}
                onOk={handleInsertYoutube}
                onCancel={() => {
                    setYoutubeModalOpen(false)
                    setYoutubeUrl('')
                }}
                okText="Chèn"
                cancelText="Hủy"
            >
                <div>
                    <label className="block mb-2 font-medium">URL YouTube:</label>
                    <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        onPressEnter={handleInsertYoutube}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Hỗ trợ: youtube.com/watch?v=... hoặc youtu.be/...
                    </p>
                </div>
            </Modal>
        </>
    )
}
