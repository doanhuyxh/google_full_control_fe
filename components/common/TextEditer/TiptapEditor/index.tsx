'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Text from '@tiptap/extension-text'
import Youtube from '@tiptap/extension-youtube'
import { MenuBar } from './MenuBar'
import { memo } from 'react'


interface TiptapComponentProp {
    value: string
    onChange: (value: string) => void
}

const extensions = [TextStyleKit, StarterKit, Text, Youtube]

const TiptapComponent = ({ value, onChange }: TiptapComponentProp) => {
    const editor = useEditor({
        extensions,
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-sm sm:prose lg:prose-lg focus:outline-none p-2 border border-gray-300 rounded min-h-[200px] w-full overflow-auto',
            },
        },
        immediatelyRender: true,
    })

    return <div>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
    </div>
}

export default memo(TiptapComponent)
