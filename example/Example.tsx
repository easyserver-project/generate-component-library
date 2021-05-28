import React, { ReactElement } from 'react'

export const Example = ({
  children,
  code,
}: {
  children: ReactElement | ReactElement[]
  code?: string
}) => {
  return (
    <div className="example-root">
      <div style={{ border: '1px solid #65656C', padding: '1rem' }}>{children}</div>
      <p />
      <details title={'Show code'}>
        <div style={{ backgroundColor: '#f6f6f6', padding: '1rem' }}>
          <code style={{ whiteSpace: 'pre', color: '#212529' }}>{code}</code>
        </div>
      </details>
    </div>
  )
}
