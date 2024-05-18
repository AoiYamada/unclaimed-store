'use client'

import { useSlatePlugin } from 'node_modules/@payloadcms/richtext-slate/dist/utilities/useSlatePlugin'
import type React from 'react'
import type { BaseEditor } from 'slate'

const WithLabel: React.FC = () => {
  useSlatePlugin('withLabel', (incomingEditor: BaseEditor) => {
    const editor: BaseEditor & {
      shouldBreakOutOnEnter?: (element: any) => boolean
    } = incomingEditor

    const { shouldBreakOutOnEnter } = editor

    if (shouldBreakOutOnEnter) {
      editor.shouldBreakOutOnEnter = (element) =>
        element.type === 'large-body' ? true : shouldBreakOutOnEnter(element)
    }

    return editor
  })

  return null
}

export default WithLabel
