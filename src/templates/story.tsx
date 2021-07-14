export const StoryTemplate = (component: string)=> `import React from 'react'
import { Example } from '../Example'

export const ${component}Story = () => {
  return (
    <>
      <h1>${component}</h1>
      <Example>
        ${component}
      </Example>
    </>
  )
}
`
