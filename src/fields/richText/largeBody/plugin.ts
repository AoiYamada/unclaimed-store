'use client'

// FIXME: Payload 3 does not have examples of useSlatePlugin
import { useSlatePlugin } from 'node_modules/@payloadcms/richtext-slate/dist/utilities/useSlatePlugin.js'
import type React from 'react'
import type { BaseEditor } from 'slate'

const WithLargeBody: React.FC = () => {
  useSlatePlugin('withLargeBody', (incomingEditor) => {
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

export default WithLargeBody
