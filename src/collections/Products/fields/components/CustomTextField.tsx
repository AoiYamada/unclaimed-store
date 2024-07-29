'use client'

import { useField } from '@payloadcms/ui'
import { FC } from 'react'

// Used to inspect field values, not in use
export const CustomTextField: FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })

  console.log(path, value)

  return <div>???</div>
}
