import React, { ReactElement } from 'react'

export const Example = ({
  children,
  code,
}: {
  children: ReactElement | ReactElement[]
  code?: string
}) => {
  return (
    <div>
      <div>{children}</div>
      <details title={'Show code'}>
        <code style={{ whiteSpace: 'pre' }}>{code}</code>
      </details>
    </div>
  )
}
