import React from 'react'
import { Button } from '../components/Button'
import { Example } from '../Example'

export const ButtonStory = () => {
  return (
    <>
      <h1>Button</h1>
      <Example code={`
        <Button text={'Button text'} />
      `}>
        <Button text={'Button text'} />
      </Example>
    </>
  )
}
