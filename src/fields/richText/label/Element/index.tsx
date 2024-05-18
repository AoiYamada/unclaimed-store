import React from 'react'

const baseClass = 'rich-text-label'

const LabelElement: React.FC<{
  attributes: any
  element: any
  children: React.ReactNode
}> = ({ attributes, children }) => (
  <div {...attributes}>
    <span
      style={{
        textTransform: 'uppercase',
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '2px',
        fontSize: 'base(.5)',
        margin: '0 0 base(1)',
      }}
      className={baseClass}
    >
      {children}
    </span>
  </div>
)
export default LabelElement
